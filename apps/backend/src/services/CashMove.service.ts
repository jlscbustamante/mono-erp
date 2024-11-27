import { badRequest } from '@hapi/boom'
import axios from 'axios'
import { format } from 'date-fns'
import { Raw } from 'typeorm'

import {
  CATEGORY_ID_CULQI_POS,
  CATEGORY_ID_IZIPAY,
  CATEGORY_ID_PAGO_ONLINE,
} from '../const'
import { CashAccount } from '../entities/CashAccount'
import { CashMove } from '../entities/CashMove'
import { Category } from '../entities/Category'
import cashAccountRepository from '../repositories/cashAccount.repository'
import { CashBalanceRepository } from '../repositories/cashBalance.repository'
import { CashMoveRepository } from '../repositories/cashMove.repository'
import categoryRepository from '../repositories/category.repository'
import { Filters } from '../types'
import { BalanceStatus } from '../types/balance'
import { CashMoveStatus } from '../types/cashMove'
import { OpFilter } from '../types/filter'
import { safeAny } from '../utils/someAny'

interface INetCashMove {
  idCatDep: number
  nombreCat: string
  idTienda: number
  tipo: 'V' | 'F' | 'G'
  descripcion: string
  valor: number
}

interface INetResponse {
  isSuccess: boolean
  result: INetCashMove[]
  messageError?: string
}

export class CashMoveService {
  constructor(
    private readonly cashMoveRepository: CashMoveRepository,
    private readonly cashBalanceRepository: CashBalanceRepository,
  ) {}

  async getFiltered(filters: Filters<CashMove>): Promise<CashMove[]> {
    return this.cashMoveRepository.filter(filters)
  }

  async getFilteredNt(filters: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<CashMove[]> {
    return this.cashMoveRepository.filterNt(filters)
  }

  async createMovement(cashMove: CashMove, user: string): Promise<void> {
    cashMove.id = null
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.created_at = now
    cashMove.updated_at = now
    cashMove.created_by = user
    cashMove.status = CashMoveStatus.Active
    await this.cashMoveRepository.insert(cashMove)
  }

  async updateMovement(cashMove: CashMove): Promise<void> {
    cashMove.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.status = CashMoveStatus.Active
    if (await this.verifyCashIsClosed(cashMove.cash_id, cashMove.approved_at))
      throw badRequest(`La caja ${cashMove.cash_id} esta cerrada.`)
    await this.cashMoveRepository.save(cashMove)
  }

  async deleteMovement(id: number, user: string): Promise<void> {
    const cashMove = new CashMove()
    cashMove.id = id
    cashMove.status = CashMoveStatus.Deleted
    cashMove.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.rejected_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.rejected_by = user
    await this.cashMoveRepository.save(cashMove)
  }

  async signMovement(id: number, user: string): Promise<void> {
    const cashMoveFounded = await this.cashMoveRepository.findOneBy({ id })
    if (
      cashMoveFounded &&
      [
        CATEGORY_ID_CULQI_POS,
        CATEGORY_ID_IZIPAY,
        CATEGORY_ID_PAGO_ONLINE,
      ].includes(cashMoveFounded?.category_expense_id)
    )
      throw new Error(
        'Estas categorias se deben firmar desde la pestaña de "conciliar metodos de pagos"',
      )
    const cashMove = new CashMove()
    cashMove.id = id
    cashMove.status = CashMoveStatus.Signed
    cashMove.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.approved_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.approved_by = user
    await this.cashMoveRepository.save(cashMove)
  }

  async unsignMovement(id: number, user: string): Promise<void> {
    const cashMove = new CashMove()
    cashMove.id = id
    cashMove.status = CashMoveStatus.Active
    cashMove.updated_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.approved_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    cashMove.approved_by = user
    await this.cashMoveRepository.save(cashMove)
  }

  async createMovements(moves: CashMove[], user: string): Promise<void> {
    // verificar si no existe
    if (moves.length == 0) return
    const count = await this.cashMoveRepository.count({
      where: {
        requested_at: Raw(
          () => `DATE(requested_at) = '${moves[0].requested_at}'`,
        ),
        cash_id: moves[0].cash_id,
      },
    })
    if (count > 0) return

    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    moves.forEach((m) => {
      m.id = null
      m.status = CashMoveStatus.Active
      m.updated_at = now
      m.created_at = now
      m.created_by = user
    })
    await this.cashMoveRepository.insert(moves)
  }

  async loadFromEfisis(date: string, user: string) {
    const cashAccounts = await cashAccountRepository.getStores()
    const categories = await categoryRepository.forStore()
    // const peticiones: safeAny = []
    for (const cashAccount of cashAccounts) {
      // peticiones.push(this.loadOneStore(cashAccount, date, user, categories))
      await this.loadOneStore(cashAccount, date, user, categories)
    }
    // await Promise.all(peticiones)
  }

  async loadOneStore(
    cashAccount: CashAccount,
    date: string,
    user: string,
    categories: Category[],
  ) {
    if (await this.cashMoveRepository.hasMoves(cashAccount.id, date)) return
    const data = await this.loadDataStore(cashAccount.codefis, date)
    if (data.isSuccess) {
      data.result.forEach((move) => {
        const category = categories.find((el) => el.id === move.idCatDep)
        const cashMove = new CashMove()
        cashMove.description = move.descripcion
        cashMove.amount = move.valor
        cashMove.cash_id = cashAccount.id
        cashMove.status = CashMoveStatus.Active
        cashMove.cash_account_id = cashAccount.account_id
        if (category) {
          cashMove.account_flow = category.account_flow as safeAny
          cashMove.category_expense_id = category.id
          cashMove.category_account_id = category.account_id
        }
        cashMove.created_by = user
        cashMove.requested_at = date
        this.cashMoveRepository.insert(cashMove)
      })
    }
  }

  private async loadDataStore(
    sucursalId: string,
    date: string,
  ): Promise<INetResponse> {
    const data = await axios.get(
      `https://api.pizzaraulsap.com/api/CajaTienda/GetCajaDetallado?tienda=${sucursalId}&fecha=${date}`,
    )
    return data.data
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
