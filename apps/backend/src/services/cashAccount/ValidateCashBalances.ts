import { eachDayOfInterval, format, parseISO, sub } from 'date-fns'
import { In, Raw } from 'typeorm'

import { CashAccount } from '../../entities/CashAccount'
import { CashBalance } from '../../entities/CashBalance'
import { BalanceRepository } from '../../repositories/balance.repository'
import cashAccountRepository from '../../repositories/cashAccount.repository'
import { BalanceStatus } from '../../types/balance'

interface IValidatorBalance {
  beforeDayIsClosed(): Promise<IValidatorBalance>
  beforeDayIsRegistered(
    cashAccounts?: CashAccount[],
  ): Promise<IValidatorBalance>
  beforeDayIsClosedOrRegistered(): Promise<IValidatorBalance>
  areRegistered(): IValidatorBalance
  hasRegistered(): IValidatorBalance
  validateStatus(): IValidatorBalance
  areClosed(): IValidatorBalance
  getLogs(): string[]
}

export class CashBalanceUtils implements IValidatorBalance {
  private readonly logs: string[] = []
  private balances: CashBalance[]
  private cashIds: number[] = []
  private dates: string[]
  private _dates: [string, string]

  constructor(private readonly balanceRepository: BalanceRepository) {}

  async validate(
    _dates: [string, string],
    cashIds: number[],
  ): Promise<IValidatorBalance> {
    this.dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[1]),
    }).map((el) => format(el, 'yyyy-MM-dd'))
    this._dates = _dates
    this.cashIds = cashIds
    this.balances = await this.balanceRepository
      .createQueryBuilder('ba')
      .select()
      .where(
        'ba.cash_account_id IN (:...cashAccountIds) AND DATE(balance_at) BETWEEN :date1 AND :date2',
        {
          cashAccountIds: cashIds,
          date1: this._dates[0],
          date2: this._dates[1],
        },
      )
      .getMany()

    return this
  }

  validateStatus(): IValidatorBalance {
    const failedIds: number[] = []
    for (const balance of this.balances) {
      if (
        balance.status_request != BalanceStatus.CLOSED &&
        balance.status_request != BalanceStatus.REGISTERED
      ) {
        failedIds.push(balance.cash_account_id)
      }
    }
    if (failedIds.length > 0) {
      this.logs.push(
        `Los siguientes tienen un status invalido en balance: ${failedIds.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  async beforeDayIsClosed(): Promise<IValidatorBalance> {
    const beforeDay = format(
      sub(parseISO(this._dates[0]), { days: 1 }),
      'yyyy-MM-dd',
    )
    const balances = await this.balanceRepository
      .createQueryBuilder('ba')
      .select()
      .where(
        `DATE(ba.balance_at)=:date AND ba.cash_account_id IN (:...cashAccountIds) AND status_request = :status`,
        {
          date: beforeDay,
          cashAccountIds: this.cashIds,
          status: BalanceStatus.CLOSED,
        },
      )
      .getMany()
    const idsClosed = balances.map((el) => el.cash_account_id)
    const idsNotClosed = this.cashIds.filter((el) => !idsClosed.includes(el))
    if (idsClosed.length == 0) {
      this.logs.push(
        `Todas las cajas seleccionadas no han sido cerradas el dia anterior`,
      )
    } else if (idsNotClosed.length > 0) {
      this.logs.push(
        `Las siguientes cajas no estan cerradas el dia anterior : ${idsNotClosed.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  async beforeDayIsClosedOrRegistered(): Promise<IValidatorBalance> {
    const beforeDay = format(
      sub(parseISO(this._dates[0]), { days: 1 }),
      'yyyy-MM-dd',
    )
    const cashIdsValidated = (
      await cashAccountRepository.find({
        select: { id: true },
        where: {
          id: In(this.cashIds),
          created_at: Raw((alias) => `DATE(${alias}) <= :date`, {
            date: beforeDay,
          }),
        },
      })
    ).map((el) => el.id)

    if (cashIdsValidated.length == 0) {
      return this
    }

    const balances = await this.balanceRepository
      .createQueryBuilder('ba')
      .select()
      .where(
        `DATE(ba.balance_at)=:date AND ba.cash_account_id IN (:...cashAccountIds) AND status_request IN (:...status)`,
        {
          date: beforeDay,
          cashAccountIds: cashIdsValidated,
          status: [BalanceStatus.CLOSED, BalanceStatus.REGISTERED],
        },
      )
      .getMany()
    const idsClosed = balances
      .filter((el) => el.status_request == BalanceStatus.CLOSED)
      .map((el) => el.cash_account_id)
    const idsRegistered = balances
      .filter((el) => el.status_request == BalanceStatus.REGISTERED)
      .map((el) => el.cash_account_id)
    if (idsRegistered.length > 0) {
      const idsNotRegistered = cashIdsValidated.filter(
        (el) => !idsRegistered.includes(el),
      )
      if (idsNotRegistered.length > 0) {
        this.logs.push(
          `Las siguientes cajas no estan contabilizadas el dia anterior : ${idsNotRegistered.join(
            ', ',
          )}`,
        )
      }
    } else {
      const idsNotClosed = cashIdsValidated.filter(
        (el) => !idsClosed.includes(el),
      )

      if (idsNotClosed.length > 0) {
        this.logs.push(
          `Las siguientes cajas no estan cerradas el dia anterior : ${idsNotClosed.join(
            ', ',
          )}`,
        )
      }
    }

    return this
  }

  async beforeDayIsRegistered(
    cashAccounts?: CashAccount[],
  ): Promise<IValidatorBalance> {
    let cashIds = this.cashIds
    const beforeDay = format(
      sub(parseISO(this._dates[0]), { days: 1 }),
      'yyyy-MM-dd',
    )
    if (cashAccounts) {
      cashIds = cashAccounts
        .filter((ca) => {
          const createdDate = format(parseISO(ca.created_at), 'yyyy-MM-dd')

          return createdDate <= beforeDay
        })
        .map((ca) => ca.id)
    }
    const balances = await this.balanceRepository
      .createQueryBuilder('ba')
      .select()
      .where(
        `DATE(ba.balance_at)=:date AND ba.cash_account_id IN (:...cashAccountIds) AND status_request = :status`,
        {
          date: beforeDay,
          cashAccountIds: cashIds,
          status: BalanceStatus.REGISTERED,
        },
      )
      .getMany()
    const idsRegistered = balances.map((el) => el.cash_account_id)
    const idsNotRegistered = cashIds.filter((el) => !idsRegistered.includes(el))
    if (idsRegistered.length == 0) {
      this.logs.push(
        `Todas las cajas seleccionadas no han sido contabilizadas el dia anterior`,
      )
    } else if (idsNotRegistered.length > 0) {
      this.logs.push(
        `Las siguientes cajas no estan contabilizadas el dia anterior : ${idsNotRegistered.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  areRegistered(): IValidatorBalance {
    const logs: string[] = []
    for (const date of this.dates) {
      const balances = this.balances.filter(
        (el) =>
          el.balance_at.split(' ')[0] == date &&
          el.status_request == BalanceStatus.REGISTERED,
      )
      const idsRegistered = balances.map((el) => el.cash_account_id)
      const idsNotRegistered = this.cashIds.filter(
        (el) => !idsRegistered.includes(el),
      )
      if (idsNotRegistered.length > 0) {
        logs.push(
          `Cajas no registradas en la fecha ${date}, ids : ${idsNotRegistered.join(
            ', ',
          )}`,
        )
      }
    }
    if (logs.length > 0) {
      this.logs.push(...logs)
    }

    return this
  }

  hasRegistered(): IValidatorBalance {
    const logs: string[] = []
    for (const date of this.dates) {
      const balances = this.balances.filter(
        (el) =>
          el.balance_at.split(' ')[0] == date &&
          el.status_request == BalanceStatus.REGISTERED,
      )
      if (balances.length == 0) continue
      const idsRegistered = balances.map((el) => el.cash_account_id)
      logs.push(
        `Cajas registradas en la fecha ${date}, ids : ${idsRegistered.join(
          ', ',
        )}`,
      )
    }
    if (logs.length > 0) {
      this.logs.push(...logs)
    }

    return this
  }

  areClosed(): IValidatorBalance {
    const logs: string[] = []
    for (const date of this.dates) {
      const balances = this.balances.filter(
        (el) =>
          el.balance_at.split(' ')[0] == date &&
          el.status_request == BalanceStatus.CLOSED,
      )
      const idsClosed = balances.map((el) => el.cash_account_id)
      const idsNotClosed = this.cashIds.filter((el) => !idsClosed.includes(el))
      if (idsNotClosed.length > 0) {
        logs.push(
          `Cajas no cerradas en la fecha ${date}, ids : ${idsNotClosed.join(
            ', ',
          )}`,
        )
      }
    }
    if (logs.length > 0) {
      this.logs.push(...logs)
    }

    return this
  }

  getLogs(): string[] {
    return this.logs
  }
}
