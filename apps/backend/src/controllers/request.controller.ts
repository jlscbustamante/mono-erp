import { Request, Response } from 'express'
import { In } from 'typeorm'

import { AppDataSource } from '../config/database'
import { RequestEntity } from '../entities/Request'
import cashAccountRepository from '../repositories/cashAccount.repository'
import cashBalanceRepository from '../repositories/cashBalance.repository'
import categoryRepository from '../repositories/category.repository'
import {
  default as CostCenterRepository,
  default as costCenterRepository,
} from '../repositories/costCenter.repository'
import {
  default as RequestRepository,
  default as requestRepository,
} from '../repositories/request.repository'
import { RequestService } from '../services/Request.service'
import rucService from '../services/ruc.service'
import { IToken } from '../types'
import { CashAccountStatus, CashAccountTypeId } from '../types/cashAccount'
import { CategoryStatus, CategoryTypeId } from '../types/category'
import { CostCenterStatus } from '../types/costCenter'
import { IUserFilter3 } from '../types/filter'
import { catchError } from '../utils/decorators'
import { safeAny } from '../utils/someAny'

const requestService = new RequestService(
  RequestRepository,
  cashBalanceRepository,
  CostCenterRepository,
)

export class RequestController {
  @catchError
  async filter(req: Request, response: Response): Promise<void> {
    const filters = req.body as IUserFilter3<RequestEntity>
    const { data: requests } = await requestRepository.filter3(filters)

    response.json({ data: requests })
  }

  @catchError
  async filterCount(req: Request, response: Response): Promise<void> {
    const filters = req.body as IUserFilter3<RequestEntity>
    const countInfo = await requestRepository.filter3Count(filters)

    response.json({ data: countInfo })
  }

  @catchError
  async createRequest(req: Request, response: Response): Promise<void> {
    const request = req.body as RequestEntity
    const token: IToken = req.headers.token as safeAny
    await requestService.createRequest(request, token.name)
    response.status(200).json({ message: 'Creado correctamente' })
  }

  @catchError
  async updateRequest(req: Request, response: Response): Promise<void> {
    const request = req.body as RequestEntity
    const token: IToken = req.headers.token as safeAny
    await requestService.updateRequest(request, token.name)
    response.status(200).json({ message: 'Actualizado correctamente' })
  }

  @catchError
  async approveRequest(req: Request, response: Response): Promise<void> {
    const id = req.params.id
    const token: IToken = req.headers.token as safeAny
    await requestService.approveRequest(Number(id), token.name)
    response.status(200).json({
      message: 'Aprobado correctamente',
    })
  }

  @catchError
  async rejectRequest(req: Request, response: Response): Promise<void> {
    const id = req.params.id
    const token: IToken = req.headers.token as safeAny
    await requestService.rejectRequest(Number(id), token.name)
    response.status(200).json({
      message: 'Rechazado correctamente',
    })
  }

  @catchError
  async getNameByRuc(req: Request, response: Response): Promise<void> {
    const ruc = req.params.ruc
    const info = await rucService.getInfoRuc(ruc)
    response.json({
      data: {
        name: info.nombre_o_razon_social,
      },
    })
  }

  @catchError
  async removeApproval(req: Request, response: Response): Promise<void> {
    const id = req.params.id
    const token: IToken = req.headers.token as safeAny
    await requestService.removeApproved(Number(id), token.name)
    response.status(200).json({
      message: 'Rechazado correctamente',
    })
  }

  @catchError
  async getCategories(req: Request, response: Response): Promise<void> {
    const categories = await categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([
            CategoryTypeId.Standard,
            CategoryTypeId.Detraction,
            CategoryTypeId.Multiple,
          ]),
        },
      },
    })
    response.json({ data: categories })
  }

  @catchError
  async getCostCenters(req: Request, response: Response): Promise<void> {
    const costCenters = await costCenterRepository.find({
      where: {
        status: CostCenterStatus.Active,
      },
    })
    response.json({ data: costCenters })
  }

  @catchError
  async getCashAccounts(req: Request, response: Response): Promise<void> {
    const cashAccounts = await cashAccountRepository.find({
      where: {
        status: CashAccountStatus.Active,
        cash_account_type: {
          type_id: In([CashAccountTypeId.Bank, CashAccountTypeId.Liquidator]),
        },
      },
      order: {
        name: 'ASC',
      },
      relations: { cash_account_type: true },
    })
    response.json({ data: cashAccounts })
  }

  @catchError
  async reportCostCenter(req: Request, response: Response): Promise<void> {
    const { start, end } = req.query
    const report = await AppDataSource.query(
      `SELECT cost_center_id costCenterId,cc.origin name,SUM(amount) total FROM adm_request ar LEFT JOIN fin_costcenter cc ON cc.id=ar.cost_center_id
    WHERE DATE(approved_at) BETWEEN ? AND ? AND ar.status IN ('A','C','T')
    GROUP BY cost_center_id,origin ORDER BY name`,
      [start, end],
    )
    response.json({ data: report })
  }
}
