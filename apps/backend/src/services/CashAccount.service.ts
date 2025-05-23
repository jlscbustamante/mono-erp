import { eachDayOfInterval, format, parseISO } from 'date-fns'

import { Account } from '../entities/Account'
import { CashAccount } from '../entities/CashAccount'
import { CashAccountType } from '../entities/CashAccountType'
import { CashBalance } from '../entities/CashBalance'
import { RequestEntity } from '../entities/Request'
import { BalanceRepository } from '../repositories/balance.repository'
import { CashAccountRepository } from '../repositories/cashAccount.repository'
import { CashMoveRepository } from '../repositories/cashMove.repository'
import { CashTypeAccountRepository } from '../repositories/cashTypeAccount.repository'
import { RequestRepository } from '../repositories/request.repository'
import { EnvFilters } from '../types'
import { BalanceStatus } from '../types/balance'
import { CashAccountStatus, CashAccountTypeStatus } from '../types/cashAccount'
import { CashMoveStatus } from '../types/cashMove'
import { CategoryTypeMove } from '../types/category'
import { OpFilter } from '../types/filter'
import {
  RequestAccountFlow,
  RequestCategoryType,
  RequestStatus,
} from '../types/request'
import { dateNow } from '../utils/getDate'
import { _reportRequest } from './cashAccount/reportRequest'
import { ResourceService } from './Resource.service'

type BalanceCash = {
  balance: number
  status: BalanceStatus
  date: string
  cashId: number
}

type EditCashType = {
  name: string
  type_id: string
  status: CashAccountTypeStatus
}

type EditCashAccount = {
  name: string
  roles_id: number
  sucursal_id: string
  account_id: number
  type_cash_id: number
  codefis: string
  status: CashAccountStatus
  cash_account_type: CashAccountType
  account: Account
}
interface ReportRequest {
  cashAccount: {
    id: number
    name: string
  }
  initialBalance: number
  status: BalanceStatus
  categories: Record<string, number>
  finalBalance: number
}

export class CashAccountService {
  constructor(
    private readonly cashAccountRepository: CashAccountRepository,
    private readonly balanceRepository: BalanceRepository,
    private readonly cashMoveRepository: CashMoveRepository,
    private readonly requestRepository: RequestRepository,
    private readonly resourceService: ResourceService,
    private readonly cashTypeAccountRepository: CashTypeAccountRepository,
  ) {}

  async getFilteredNt(
    filters: EnvFilters<CashAccount>,
  ): Promise<CashAccount[]> {
    return this.cashAccountRepository.filterNt(filters)
  }

  async getFilteredTypeNt(
    filters: EnvFilters<CashAccountType>,
  ): Promise<CashAccountType[]> {
    return this.cashTypeAccountRepository.filterTypeNt(filters)
  }

  async initialBalance(
    cashAccountId: number,
    date: string,
    type: 'request' | 'store',
  ): Promise<BalanceCash> {
    const balance = await this.getNearestBalance(cashAccountId, date)
    if (!balance)
      return {
        balance: 0,
        status: BalanceStatus.NONE,
        date,
        cashId: cashAccountId,
      }
    const balanceDate = format(parseISO(balance.balance_at), 'yyyy-MM-dd')
    const formatedDate = format(parseISO(date), 'yyyy-MM-dd')
    if (balanceDate === formatedDate)
      return {
        balance: balance.balance,
        status: balance.status_request,
        date: balance.balance_at,
        cashId: cashAccountId,
      }
    if (type === 'request') {
      const excBalance = await this.calculateBalanceRequest(
        cashAccountId,
        balanceDate,
        formatedDate,
      )

      return {
        balance: excBalance + balance.balance,
        status: BalanceStatus.NONE,
        date,
        cashId: cashAccountId,
      }
    }
    const excBalance = await this.calculateBalanceStore(
      cashAccountId,
      balanceDate,
      formatedDate,
    )

    return {
      balance: excBalance + balance.balance,
      status: BalanceStatus.NONE,
      date,
      cashId: cashAccountId,
    }
  }

  async updateCashAccount(
    existingCashAccount: CashAccount,
    args: EditCashAccount,
  ) {
    try {
      existingCashAccount.updated_at = dateNow()
      existingCashAccount.name = args.name
      existingCashAccount.account_id = args.account_id
      existingCashAccount.codefis = args.sucursal_id
      existingCashAccount.roles_id = args.roles_id

      existingCashAccount.type_cash_id = args.type_cash_id
      existingCashAccount.codefis = args.codefis
      existingCashAccount.status = args.status
      existingCashAccount.cash_account_type = args.cash_account_type
      existingCashAccount.account = args.account

      return await this.cashAccountRepository.save(existingCashAccount)
    } catch (error: any) {
      throw new Error(`Error al actualizar la cuenta de efectivo: ${error}`)
    }
  }

  async updateCashType(
    existingCashAccount: CashAccountType,
    args: EditCashType,
  ) {
    try {
      existingCashAccount.name = args.name
      existingCashAccount.type_id = args.type_id
      existingCashAccount.status = args.status

      return await this.cashTypeAccountRepository.save(existingCashAccount)
    } catch (error: any) {
      throw new Error(`Error al actualizar la cuenta de efectivo: ${error}`)
    }
  }

  async createCashAccount(args: EditCashAccount) {
    try {
      const newCashAccount = new CashAccount()
      newCashAccount.updated_at = dateNow()
      newCashAccount.name = args.name
      newCashAccount.codefis = args.sucursal_id
      newCashAccount.roles_id = args.roles_id
      newCashAccount.account_id = args.account_id
      newCashAccount.type_cash_id = args.type_cash_id
      newCashAccount.codefis = args.codefis

      newCashAccount.status = args.status
      newCashAccount.cash_account_type = args.cash_account_type
      newCashAccount.account = args.account
      newCashAccount.updated_at = dateNow()
      newCashAccount.created_at = dateNow()
      return await this.cashAccountRepository.save(newCashAccount)
    } catch (error: any) {
      throw new Error(`Error al crear la cuenta de efectivo: ${error}`)
    }
  }

  async createCashBalance(
    accountId: number,
    balance: number,
    date: Date,
    name: string,
  ): Promise<void> {
    try {
      const newBalance = new CashBalance()
      const datee = format(date, 'yyyy-MM-dd HH:mm:ss')
      newBalance.balance = balance
      newBalance.balance_at = dateNow()
      newBalance.cash_account_id = accountId
      newBalance.status_request = BalanceStatus.NONE
      newBalance.created_by = name
      newBalance.created_at = datee
      console.log(dateNow())
      await this.balanceRepository.save(newBalance)
    } catch (error: any) {
      throw new Error(`Error al crear la cuenta de balance: ${error}`)
    }
  }
  // cajas contabilizadas

  async createTypeCashAccount(args: EditCashType) {
    try {
      const newTypeCashAccount = new CashAccountType()
      newTypeCashAccount.name = args.name
      newTypeCashAccount.type_id = args.type_id
      newTypeCashAccount.status = args.status
      return await this.cashTypeAccountRepository.save(newTypeCashAccount)
    } catch (error: any) {
      throw new Error(`Error al crear la cuenta de efectivo: ${error}`)
    }
  }

  async getBalanceReport(
    _dates: string[],
    type: 'request' | 'store',
  ): Promise<{
    [key: string]: BalanceStatus
  }> {
    const dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[_dates.length - 1]),
    }).map((date) => format(date, 'yyyy-MM-dd'))

    let cashAccounts: CashAccount[] = []
    if (type == 'request')
      cashAccounts = await this.resourceService.getCashAccountsRequest()
    else cashAccounts = await this.resourceService.getCashAccountsStore()

    const cashIds = cashAccounts
      .filter((ca) => {
        const createdDate = format(parseISO(ca.created_at), 'yyyy-MM-dd')
        const date2 = format(parseISO(dates[dates.length - 1]), 'yyyy-MM-dd')

        return createdDate <= date2
      })
      .map((ca) => ca.id)

    if (!cashAccounts.length) return {}
    const balances = await this.balanceRepository
      .createQueryBuilder('ba')
      .where(
        'DATE(ba.balance_at) BETWEEN :date1 AND :date2 AND ba.cash_account_id IN (:...cashIds)',
        {
          date1: dates[0],
          date2: dates[dates.length - 1],
          cashIds,
        },
      )
      .getMany()

    const states: {
      [key: string]: BalanceStatus
    } = {}
    dates.forEach((date) => {
      const cashIdsInDate = cashAccounts
        .filter((ca) => {
          const createdDate = format(parseISO(ca.created_at), 'yyyy-MM-dd')
          const date2 = format(parseISO(date), 'yyyy-MM-dd')

          return createdDate <= date2
        })
        .map((ca) => ca.id)
      const balancesInDate = balances.filter((b) => b.balance_at.includes(date))
      states[date] = BalanceStatus.NONE
      if (balancesInDate.length > 0) {
        const isClosed = balancesInDate.every(
          (b) => b.status_request === BalanceStatus.CLOSED,
        )
        const isRegistered = balancesInDate.every(
          (b) => b.status_request === BalanceStatus.REGISTERED,
        )
        const isIncomplete = cashIdsInDate.every((cashId) =>
          balancesInDate.some((b) => b.cash_account_id === cashId),
        )
        if (!isIncomplete) states[date] = BalanceStatus.NONE
        else if (!isClosed && !isRegistered) states[date] = BalanceStatus.NONE
        else if (isClosed) states[date] = BalanceStatus.CLOSED
        else if (isRegistered) states[date] = BalanceStatus.REGISTERED
      }
    })

    return states
  }

  async reportRequest(date: string): Promise<ReportRequest[]> {
    const report = await _reportRequest(
      this,
      date,
      this.resourceService,
      this.requestRepository,
    )

    return report
  }

  async detailedReportRequest(
    cashAccountId: number,
    date: string,
  ): Promise<{
    balance: number
    status: BalanceStatus
    requests: RequestEntity[]
  }> {
    const { data: requestsInCash } = await this.requestRepository.filter3({
      filters: {
        cash_id: [OpFilter.Equal, cashAccountId],
        approved_at: [OpFilter.EqualDate, date],
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Closed,
          RequestStatus.Registered,
        ],
      },
    })
    const { data: requestsInCategory } = await this.requestRepository.filter3({
      filters: {
        category_id: [OpFilter.Equal, cashAccountId],
        approved_at: [OpFilter.EqualDate, date],
        category_move: [OpFilter.Equal, RequestCategoryType.Cash],
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Closed,
          RequestStatus.Registered,
        ],
      },
    })
    const initialBalance = await this.initialBalance(
      cashAccountId,
      date,
      'request',
    )

    return {
      balance: initialBalance.balance,
      status: initialBalance.status,
      requests: [...requestsInCash, ...requestsInCategory],
    }
  }

  private async calculateBalanceStore(
    cashAccountId: number,
    balanceDate: string,
    date: string,
  ): Promise<number> {
    let baseBalance = 0
    const movements = await this.cashMoveRepository.filterNt({
      cash_id: [OpFilter.Equal, cashAccountId],
      requested_at: [OpFilter.SinceTo, balanceDate, date],
      status: [
        OpFilter.In,
        CashMoveStatus.Active,
        CashMoveStatus.Closed,
        CashMoveStatus.Registered,
        CashMoveStatus.Signed,
      ],
    })
    for (const movement of movements) {
      if (movement.category?.type_mov === CategoryTypeMove.Expense)
        baseBalance -= movement.amount
      else if (movement.category?.type_mov === CategoryTypeMove.Sale)
        baseBalance += movement.amount
    }

    return baseBalance
  }

  private async calculateBalanceRequest(
    cashAccountId: number,
    balanceDate: string,
    date: string,
  ): Promise<number> {
    let baseBalance = 0
    const { data: inCash } = await this.requestRepository.filter3({
      filters: {
        cash_id: [OpFilter.Equal, cashAccountId],
        approved_at: [OpFilter.SinceTo, balanceDate, date],
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Closed,
          RequestStatus.Registered,
        ],
      },
    })

    const { data: inCategory } = await this.requestRepository.filter3({
      filters: {
        category_id: [OpFilter.Equal, cashAccountId],
        approved_at: [OpFilter.SinceTo, balanceDate, date],
        category_move: [OpFilter.Equal, RequestCategoryType.Cash],
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Closed,
          RequestStatus.Registered,
        ],
      },
    })
    for (const request of inCash) {
      const amount =
        request.retention == '1' ? request.amount_net : request.amount
      if (request.account_flow === RequestAccountFlow.In) baseBalance += amount
      else baseBalance -= amount
    }
    for (const request of inCategory) {
      const amount =
        request.retention == '1' ? request.amount_net : request.amount
      if (request.account_flow === RequestAccountFlow.In) baseBalance -= amount
      else baseBalance += amount
    }

    return baseBalance
  }

  private async getNearestBalance(
    cashAccountId: number,
    date: string,
  ): Promise<CashBalance | null> {
    return this.balanceRepository
      .createQueryBuilder('ba')
      .where(
        'DATE(ba.balance_at) <= DATE(:date) AND ba.cash_account_id = :cashAccountId',
        { date, cashAccountId },
      )
      .orderBy('ba.balance_at', 'DESC')
      .addOrderBy('ba.created_at', 'DESC')
      .limit(1)
      .getOne()
  }
}
