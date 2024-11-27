import { In } from 'typeorm'

import { Account } from '../../entities/Account'
import { CashMove } from '../../entities/CashMove'
import { CostCenter } from '../../entities/CostCenter'
import { Parameter } from '../../entities/Parameter'
import { AccountRepository } from '../../repositories/account.repository'
import { CashMoveRepository } from '../../repositories/cashMove.repository'
import { CostCenterRepository } from '../../repositories/costCenter.repository'
import { ParameterRepository } from '../../repositories/parameter.repository'
import { CashMoveStatus } from '../../types/cashMove'
import { CategoryTypeId } from '../../types/category'

interface IValidationCashMove {
  getLogs(): string[]
}
export class CashMoveUtils implements IValidationCashMove {
  private readonly logs: string[] = []
  // private cashMoves: Request[] = []
  // private dates: string[] = []
  // private _dates: [string, string] = []

  constructor(
    private readonly cashMoveRepository: CashMoveRepository,
    private readonly parameterRepository: ParameterRepository,
    private readonly costCenterRepository: CostCenterRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  // async validate(): Promise<IVallidationCashMove> {
  //   return this
  // }
  async validateActives(
    cashIds: number[],
    _dates: [string, string],
  ): Promise<IValidationCashMove> {
    const promises = []
    for (const cashId of cashIds) {
      promises.push(
        this.cashMoveRepository
          .createQueryBuilder('cm')
          .select('COUNT(cm.id) actives, cm.cash_id cashId')
          .where(
            'cm.cash_id=:cashId AND cm.status=:status AND DATE(cm.requested_at) BETWEEN :start AND :end',
            {
              cashId,
              status: CashMoveStatus.Active,
              start: _dates[0],
              end: _dates[1],
            },
          )
          .groupBy('cm.cash_id')
          .execute(),
      )
    }
    const responses: { actives: string; cashId: number }[][] =
      await Promise.all(promises)
    for (const response of responses) {
      if (response[0] && Number(response[0].actives) > 0) {
        this.logs.push(
          `La caja id - ${response[0].cashId} tiene ${response[0].actives} movimientos activos durante el rango de fechas: ${_dates[0]} - ${_dates[1]}`,
        )
      }
    }

    // return responses
    return this
  }

  async setCostCenter(
    cashMoves: CashMove[],
  ): Promise<{ move: CashMove; costCenter: CostCenter }[]> {
    const finalData: { move: CashMove; costCenter: CostCenter }[] = []
    const accountsIds = cashMoves.map((cm) => cm.cash_account_id)
    const costCenters = await this.costCenterRepository.find({
      where: {
        account_caja: In(accountsIds),
      },
    })
    const costCenterMap: Map<string, CostCenter> = new Map()
    costCenters.forEach((el) => {
      costCenterMap.set(el.account_caja.toString(), el)
    })
    for (const move of cashMoves) {
      const costCenter = costCenterMap.get(move.cash_account_id.toString())
      if (!costCenter) {
        this.logs.push(
          `No existe cuenta en cost_center para la caja: ${move.cash_account_id}, id del movimiento: ${move.id}`,
        )
        continue
      }

      finalData.push({
        move,
        costCenter,
      })
    }

    return finalData
  }

  async setCategoryMultiple(
    cashMoves: { move: CashMove; costCenter: CostCenter }[],
  ): Promise<{ move: CashMove; costCenter: CostCenter }[]> {
    const logs: string[] = []
    const cashMoveMultiple = cashMoves.filter(
      (cashMove) =>
        cashMove.move?.category?.categoryType.type_id ===
        CategoryTypeId.Multiple,
    )
    const ids = cashMoveMultiple.map((el) => el.move.category_account_id)
    const parameterMap: Map<string, Parameter> = new Map()
    const parameters = await this.parameterRepository.getMultipleAccount(ids)
    parameters.forEach((el) => {
      parameterMap.set(el.id.toString(), el)
    })

    const accountIds: number[] = []
    for (const move of cashMoves) {
      const parameter = parameterMap.get(
        move.move.category_account_id.toString(),
      )
      if (!parameter) {
        logs.push(
          `No existe parametro con value: ${move.move.category_account_id}, id del movimiento: ${move.move.id}`,
        )
        continue
      }
      let accountId = undefined
      switch (parameter.name) {
        case 'CAJA':
          accountId = move.costCenter?.account_caja
          break
        case 'AJUSTE':
          accountId = move.costCenter?.account_ajuste
          break
        case 'MERCADERIA':
          accountId = move.costCenter?.account_merca
          break
      }
      if (!accountId) {
        logs.push(
          `No existe cuenta en cost_center para la categoria multiple : ${move.move.category_account_id}, id del movimiento: ${move.move.id}`,
        )
        continue
      }
      accountIds.push(accountId)
      move.move.category_account_id = accountId
    }

    const accounts = await this.accountRepository.find({
      where: { id: In(accountIds) },
    })
    const accountsMap: Map<string, Account> = new Map()
    accounts.forEach((account) => {
      accountsMap.set(account.id.toString(), account)
    })
    for (const move of cashMoves) {
      const account = accountsMap.get(move.move.category_account_id.toString())
      if (!account) {
        logs.push(
          `No existe cuenta en account para la categoria multiple : id de la cuenta(encontrada en parametros) : ${move.move.category_account_id}, id del movimiento: ${move.move.id}`,
        )
        continue
      }

      move.move.categoryAccountAE = account
    }

    return cashMoves
  }

  getLogs(): string[] {
    return this.logs
  }
}
