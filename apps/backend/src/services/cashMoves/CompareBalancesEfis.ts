import axios from 'axios'
import { add, eachDayOfInterval, format, parseISO } from 'date-fns'

import { CashAccount } from '../../entities/CashAccount'
import { CashMoveRepository } from '../../repositories/cashMove.repository'
import { BalanceStatus } from '../../types/balance'
import { CashMoveStatus } from '../../types/cashMove'
import { safeAny } from '../../utils/someAny'
import { CashAccountService } from '../CashAccount.service'
import { ResourceService } from '../Resource.service'

enum StatusCompare {
  Cerrado = 'Cerrado',
  Contabilizado = 'Contabilizado',
  Pendiente = 'Pendiente',
  Listo = 'Listo para el cierre',
  Descuadre = 'Descuadre',
}

export class CompareBalancesEfis {
  private readonly netUrl = 'https://api.pizzaraulsap.com/api'

  constructor(
    private readonly cashMoveRepository: CashMoveRepository,
    private readonly resourceService: ResourceService,
    private readonly cashAccountService: CashAccountService,
  ) {}

  async execute(_dates: [string, string]): Promise<safeAny> {
    const dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[1]),
    }).map((date) => format(date, 'yyyy-MM-dd'))
    // const stores = await this.resourceService.getCashAccountsStore()
    const stores = await this.getCashAccountsStore(_dates[0])
    const promisesByDate = dates.map((date) => {
      return stores.map((store) => this.getInfoForStore(store, date))
    })
    const promises = ([] as Promise<safeAny>[]).concat(...promisesByDate)
    const responsesPromise = await Promise.all(promises)

    return responsesPromise as object
  }

  // truncarDecimal(numero: number, decimales: number) {
  //   const factor = Math.pow(10, decimales)
  //   return Math.trunc(numero * factor) / factor
  // }
  compareNumbersWithTolerance(number1: number, number2: number) {
    const tolerance = 0.05
    if (Math.abs(number1 - number2) < tolerance) return true
    return false
  }

  private async getInfoForStore(
    store: CashAccount,
    date: string,
  ): Promise<safeAny> {
    const nextDate = format(add(parseISO(date), { days: 1 }), 'yyyy-MM-dd')
    const results = await Promise.all([
      this.getActiveMovements(store.id, date),
      this.getPromiseInitialBalanceNet(store.codefis, nextDate),
      this.getPromiseInitialBalance(store.id, date, nextDate),
    ])

    const status: string[] = []
    let success = true
    let efisAmount = results[1]
    const adminAmount = results[2].balance

    if (!results[1] || isNaN(results[1])) {
      efisAmount = 0
    }
    // if (efisAmount.toFixed(1) != adminAmount.toFixed(1)) {
    if (
      // this.truncarDecimal(efisAmount, 1) != this.truncarDecimal(adminAmount, 1)
      !this.compareNumbersWithTolerance(efisAmount, adminAmount)
    ) {
      status.push(StatusCompare.Descuadre)
      success = false
    }
    if (results[0] > 0) {
      status.push(StatusCompare.Pendiente)
      success = false
    }

    if (results[2].status == BalanceStatus.CLOSED)
      status.push(StatusCompare.Cerrado)
    else if (results[2].status == BalanceStatus.REGISTERED)
      status.push(StatusCompare.Contabilizado)
    else if (status.length == 0) {
      status.push(StatusCompare.Listo)
      success = true
    }

    return {
      storeId: store.id,
      efis: efisAmount,
      admin: results[2],
      pendingMovements: results[0],
      status,
      success,
      nameStore: store.name,
      date,
    }
  }

  private async getActiveMovements(
    storeId: number,
    date: string,
  ): Promise<number> {
    const data = await this.cashMoveRepository
      .createQueryBuilder('cm')
      .select(['COUNT(*) as count'])
      .where(
        'DATE(cm.requested_at)=:date AND cm.status=:status AND cm.cash_id=:cashId',
        {
          date,
          status: CashMoveStatus.Active,
          cashId: storeId,
        },
      )
      .execute()
    if (!data) return 0

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number(data[0].count)
  }

  private async getPromiseInitialBalanceNet(
    codefis: string,
    date: string,
  ): Promise<number> {
    const data = await axios.get(
      `${this.netUrl}/CajaTienda/GetSaldoInicialEfisis?codTienda=${codefis}&fecha=${date}`,
    )
    const result = (await data.data) as {
      result: {
        saldoInicial: number
      }[]
    }

    if (result.result.length == 0) return 0

    return Number(result.result[0].saldoInicial.toFixed(2))
  }

  private async getPromiseInitialBalance(
    id: number,
    date: string,
    nextDate: string,
  ) {
    const data = await this.cashAccountService.initialBalance(
      id,
      nextDate,
      'store',
    )
    const initialBal = await this.cashAccountService.initialBalance(
      id,
      date,
      'store',
    )
    data.status = initialBal.status

    return data
  }

  private async getCashAccountsStore(date: string): Promise<CashAccount[]> {
    const cashAccounts = (
      await this.resourceService.getCashAccountsStore()
    ).filter((cashAccount) => {
      const createdDate = format(parseISO(cashAccount.created_at), 'yyyy-MM-dd')
      const dateAE = format(parseISO(date), 'yyyy-MM-dd')

      return createdDate <= dateAE
    })

    return cashAccounts
  }
}
