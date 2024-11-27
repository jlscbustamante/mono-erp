import { eachDayOfInterval, format, parseISO } from 'date-fns'

import { AppDataSource } from '../../config/database'
import { CashBalance } from '../../entities/CashBalance'
import accountRepository from '../../repositories/account.repository'
import balanceRepository from '../../repositories/balance.repository'
import cashMoveRepository, {
  CashMoveRepository,
} from '../../repositories/cashMove.repository'
import costCenterRepository from '../../repositories/costCenter.repository'
import parameterRepository from '../../repositories/parameter.repository'
import { RequestRepository } from '../../repositories/request.repository'
import { BalanceStatus } from '../../types/balance'
import { CashMoveStatus } from '../../types/cashMove'
import { RequestStatus } from '../../types/request'
import { dateNow } from '../../utils/getDate'
import { CashAccountService } from '../CashAccount.service'
import { CashBalanceUtils } from './ValidateCashBalances'
import { CashMoveUtils } from './ValidateCashMoves'
import { RequestUtils } from './ValidateRequest'

interface Config {
  replace?: boolean
  force?: boolean
}
export class CloseCashAccount {
  constructor(
    private readonly cashAccountService: CashAccountService,
    private readonly requestRepository: RequestRepository,
    private readonly cashMoveRepository: CashMoveRepository,
  ) {}

  async closeCashAccountsRequest(
    cashAccountIds: number[],
    _dates: [string, string],
    { force = false }: Config,
  ): Promise<string[] | undefined> {
    const dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[1]),
    }).map((el) => format(el, 'yyyy-MM-dd'))
    const balanceUtil = new CashBalanceUtils(balanceRepository)
    const requestUtil = new RequestUtils(
      this.requestRepository,
      parameterRepository,
      accountRepository,
    )
    const reqValidator = await requestUtil.validate(_dates)
    const validator = await balanceUtil.validate(_dates, cashAccountIds)
    if (!force) await validator.beforeDayIsClosedOrRegistered()
    validator.hasRegistered()

    reqValidator.hasRegistered()
    const logs = [...validator.getLogs(), ...reqValidator.getLogs()]
    if (logs.length > 0) return logs

    const promisesBalances = []
    for (const date of dates) {
      for (const cashAccountId of cashAccountIds) {
        promisesBalances.push(
          this.cashAccountService.initialBalance(
            cashAccountId,
            date,
            'request',
          ),
        )
      }
    }

    const balancesGetted = await Promise.all(promisesBalances)
    const balanceForInsert = balancesGetted.map((el) => {
      const bl = new CashBalance()
      bl.id = null
      bl.balance_at = el.date
      bl.cash_account_id = el.cashId
      bl.balance = el.balance
      bl.status_request = BalanceStatus.CLOSED
      bl.created_at = dateNow()

      return bl
    })

    const queryUpdateRequests = this.requestRepository
      .createQueryBuilder()
      .update()
      .set({ status: RequestStatus.Closed })
      .where('status= :status', { status: RequestStatus.Approved })
      .andWhere('DATE(approved_at) BETWEEN :start AND :end', {
        start: _dates[0],
        end: _dates[1],
      })
      .getQueryAndParameters()

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(CashBalance)
        .where(
          'DATE(balance_at) BETWEEN :start AND :end AND cash_account_id IN (:...cashAccountIds) ',
          { cashAccountIds, start: _dates[0], end: _dates[1] },
        )
        .execute()

      await transactionalEntityManager.insert(CashBalance, balanceForInsert)
      await transactionalEntityManager.query(
        queryUpdateRequests[0],
        queryUpdateRequests[1],
      )
    })
  }

  async closeCashAccountsStore(
    cashAccountIds: number[],
    _dates: [string, string],
    { force = false }: Config,
  ): Promise<string[] | undefined> {
    const dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[1]),
    }).map((el) => format(el, 'yyyy-MM-dd'))
    const balanceUtil = new CashBalanceUtils(balanceRepository)
    const cashMoveUtil = new CashMoveUtils(
      cashMoveRepository,
      parameterRepository,
      costCenterRepository,
      accountRepository,
    )
    const validator = await balanceUtil.validate(_dates, cashAccountIds)
    const cashMoveValidator = await cashMoveUtil.validateActives(
      cashAccountIds,
      _dates,
    )
    if (!force) await validator.beforeDayIsClosedOrRegistered()
    validator.hasRegistered()

    const logs = [...validator.getLogs(), ...cashMoveValidator.getLogs()]

    if (logs.length > 0) return logs

    const promisesBalances = []
    for (const date of dates) {
      for (const cashAccountId of cashAccountIds) {
        promisesBalances.push(
          this.cashAccountService.initialBalance(cashAccountId, date, 'store'),
        )
      }
    }

    const balancesGetted = await Promise.all(promisesBalances)
    const balanceForInsert = balancesGetted.map((el) => {
      const bl = new CashBalance()
      bl.id = null
      bl.balance_at = el.date
      bl.cash_account_id = el.cashId
      bl.balance = el.balance
      bl.status_request = BalanceStatus.CLOSED
      bl.created_at = dateNow()

      return bl
    })

    const queryUpdateMoves = this.cashMoveRepository
      .createQueryBuilder()
      .update()
      .set({ status: CashMoveStatus.Closed })
      .where('status= :status', { status: CashMoveStatus.Signed })
      .andWhere('DATE(requested_at) BETWEEN :start AND :end', {
        start: _dates[0],
        end: _dates[1],
      })
      .getQueryAndParameters()

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(CashBalance)
        .where(
          'DATE(balance_at) BETWEEN :start AND :end AND cash_account_id IN (:...cashAccountIds) ',
          { cashAccountIds, start: _dates[0], end: _dates[1] },
        )
        .execute()

      await transactionalEntityManager.insert(CashBalance, balanceForInsert)
      await transactionalEntityManager.query(
        queryUpdateMoves[0],
        queryUpdateMoves[1],
      )
    })
  }
}
