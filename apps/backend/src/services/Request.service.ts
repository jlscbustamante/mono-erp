import { badRequest } from '@hapi/boom'
import { format } from 'date-fns'

import { RequestEntity } from '../entities/Request'
import { CashBalanceRepository } from '../repositories/cashBalance.repository'
import { CostCenterRepository } from '../repositories/costCenter.repository'
import { invPurchaseRepository } from '../repositories/inventory/purchase.repository'
import { RequestRepository } from '../repositories/request.repository'
import { BalanceStatus } from '../types/balance'
import { CategoryTypeId } from '../types/category'
import {
  RequestAccountFlow,
  RequestCategoryType,
  RequestStatus,
  RequestType,
} from '../types/request'
import { dateNow } from '../utils/getDate'

export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly cashBalanceRepository: CashBalanceRepository,
    private readonly costCenterRepository: CostCenterRepository,
  ) {}

  async getAll(): Promise<RequestEntity[]> {
    return this.requestRepository.find({ take: 10 })
  }

  async createRequest(request: RequestEntity, user: string): Promise<void> {
    request.id = null
    request.requested_at = dateNow()
    request.created_by = user
    request.approved_at = dateNow()
    request.status = RequestStatus.Pending
    await this.requestRepository.insert(request)
  }

  async updateRequest(request: RequestEntity, user: string): Promise<void> {
    request.status = RequestStatus.Pending
    request.created_by = user
    await this.requestRepository.save(request)
  }

  async approveRequest(id: number, user: string): Promise<void> {
    const request = (await this.requestRepository.findOne({
      where: { id },
      relations: [
        'cashAccount',
        'category',
        'category.categoryType',
        'costCenter',
        'cashAccountCategory',
      ],
    })) as RequestEntity
    await this.validateRquestBeforeApprove(request)
    request.status = RequestStatus.Approved
    if (!request.account_flow) {
      if (request.request_type == RequestType.Supplier)
        request.account_flow = RequestAccountFlow.Out
    }
    // request.approved_at = request.approved_at
    request.approved_by = user
    await this.requestRepository.update(id, request)
    if (request.purchaseId) {
      invPurchaseRepository.update(request.purchaseId, { status: 3 })
    }
  }

  async rejectRequest(id: number, user: string): Promise<void> {
    // const request = new RequestEntity()
    const request = await this.requestRepository.findOne({ where: { id } })
    if (!request) throw badRequest('No se encontro el requerimiento')
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    request.status = RequestStatus.Rejected
    request.rejected_at = now
    request.rejected_by = user
    await this.requestRepository.save(request)
    if (request.purchaseId) {
      invPurchaseRepository.update(request.purchaseId, { status: 9 })
    }
  }

  async removeApproved(id: number, user: string): Promise<void> {
    const request = new RequestEntity()
    request.id = id
    request.status = RequestStatus.Pending
    request.approved_by = user
    await this.requestRepository.update(
      { id, status: RequestStatus.Approved },
      request,
    )
  }

  private async validateRquestBeforeApprove(
    request: RequestEntity | null,
  ): Promise<void> {
    if (!request) throw badRequest('El requerimiento no fue encontrado')
    if (
      (request.category_move === RequestCategoryType.Cash &&
        !request.cashAccountCategory) ||
      !request.cashAccount
    )
      throw badRequest('La cuenta de caja no fue encontrada')
    if (!request.category) throw badRequest('La categoria no fue encontrada')

    if (
      request.category.categoryType.type_id === CategoryTypeId.Multiple &&
      request.costCenter?.is_cash != 1 &&
      request.category_move === RequestCategoryType.Category
    ) {
      throw badRequest(
        `El requerimiento tiene una categoria de tipo multiple pero el centro de costo no es valido`,
      )
    }
    if (!request.approved_at)
      throw badRequest('El requerimiento tiene tiene una fecha de aprobacion')
    if (await this.verifyCashIsClosed(request.cash_id, request.approved_at)) {
      throw badRequest(`La caja ${request.cash_id} esta cerrada o registrada.`)
    }
    if (request.category_move === RequestCategoryType.Cash) {
      if (
        await this.verifyCashIsClosed(request.category_id, request.createdAt)
      ) {
        throw badRequest(`La caja ${request.cash_id} esta cerrada.`)
      }
    } else if (
      request.category.categoryType.type_id === CategoryTypeId.Multiple
    ) {
      const costCenter = await this.costCenterRepository.findOne({
        where: { id: request.cost_center_id, is_cash: 1 },
      })
      if (!costCenter) {
        throw badRequest(
          `El centro de costo ${request.cost_center_id} no existe o no es valido para la categoria multiple.`,
        )
      }
    }
  }

  private async verifyCashIsClosed(
    cashId: number,
    date: string,
  ): Promise<boolean> {
    const cashBalance = await this.cashBalanceRepository.findOneByDate(
      date,
      cashId,
    )
    if (
      cashBalance &&
      (cashBalance.status_request === BalanceStatus.CLOSED ||
        cashBalance.status_request === BalanceStatus.REGISTERED)
    ) {
      return true
    }

    return false
  }
}
