import { format } from 'date-fns'
import { Request, Response } from 'express'

import { AppDataSource } from '../../config/database'
import { catchError } from '../../utils/decorators'

type TAccount = {
  account_id: string
  account_name: string
  account_father_id: string
  account_father_name: string
}
type Datos = {
  account_id: string
  account_name: string
  rpt_group: string
  valor_final: string
}

function agruparPorRptGroup(datos: Datos[]): Record<string, Datos[]> {
  return datos.reduce(
    (resultado, dato) => {
      const { rpt_group } = dato
      if (!resultado[rpt_group]) {
        resultado[rpt_group] = []
      }
      resultado[rpt_group].push(dato)
      return resultado
    },
    {} as Record<string, Datos[]>,
  )
}

export class ReportDBController {
  @catchError
  async getAccountMoves(req: Request, res: Response): Promise<void> {
    const { start, end, accountIds, costCenterIds } = req.body
    let costCenters = []

    const optionalQueryCostCenter = 'and cost_center_id in (?)'
    const optionalQueryAccountId =
      'and (account_id in (?) OR account_father_id in (?))'
    const moves = await AppDataSource.query(
      `SELECT move_id, move_type, move_at, gloss, cost_center_id, cost_center_name, transaction_key, account_id, account_name, account_father_id, account_father_name, amount_debit, amount_credit,is_cash FROM view_red_accountmove WHERE DATE(move_at) between ? and ?  ${
        accountIds ? optionalQueryAccountId : ''
      } AND ((account_id = 220 and DATE(move_at) = "${end}") OR (account_id <> 220 and transaction_key is not null and transaction_key <> "0")) ${
        costCenterIds ? optionalQueryCostCenter : ''
      }`,
      [start, end, accountIds, accountIds, costCenterIds],
    )

    if (accountIds) {
      const _costCenters = await AppDataSource.query(
        `SELECT DISTINCT cost_center_id, cost_center_name FROM view_red_accountmove WHERE DATE(move_at) between ? and ? AND account_id in (?) and cost_center_id IS NOT NULL order by cost_center_id asc`,
        [start, end, accountIds],
      )
      costCenters = _costCenters
    }
    const _fathers: TAccount[] = await AppDataSource.query(
      `select distinct account_id, account_name, account_father_id, account_father_name from view_red_accountmove where DATE(move_at) between ? and ? group by account_id order by account_id asc`,
      [start, end],
    )
    const fathers = _fathers.reduce((acc, father) => {
      if (!acc[father.account_father_id])
        acc[father.account_father_id] = {
          account_id: father.account_father_id,
          account_name: father.account_father_name,
          children: [],
        }
      return acc
    }, {} as any)
    for (const account of _fathers) {
      fathers[account.account_father_id].children.push({
        account_id: account.account_id,
        account_name: account.account_name,
      })
    }
    res.json({
      fathers: Object.keys(fathers).map((key) => {
        return fathers[key]
      }),
      costCenters,
      moves,
    })
  }

  @catchError
  async estadosResultados(req: Request, res: Response): Promise<void> {
    const { date } = req.query
    const periodos: {
      periodo_inicio: string
      periodo_final: Date
      periodo: string
    }[] = await AppDataSource.query(
      `select distinct eerr_period periodo, eerr_to periodo_final,eerr_from periodo_inicio from view_red_balance
      where eerr_period is not null order by eerr_to ASC`,
    )
    if (periodos.length < 1) {
      res.json({
        data: {
          date: date ?? null,
          periodos: [],
          datos: {},
        },
      })
      return
    }
    const selectedDate =
      date ?? format(periodos[periodos.length - 1].periodo_final, 'yyyy-MM-dd')
    const data: {
      account_id: string
      account_name: string
      rpt_group: string
      valor_final: string
    }[] = await AppDataSource.query(
      `select account_id, account_name, rpt_group,
    case
     when rpt_account_flow = "E" and rpt_group in ("Ventas","CostoM")
       then abs(balance_last + balance_credit)
       when rpt_account_flow = "E" and rpt_group not in ("Ventas","CostoM")
       then abs(balance_last + balance_debit)
       else abs(balance_credit)
     end as valor_final
   from view_red_balance
   where eerr_period is not null
   and rpt_group is not null
   and DATE(eerr_to) = ?
   order by rpt_group, account_id asc`,
      [selectedDate],
    )
    const grouped = agruparPorRptGroup(data)
    res.json({
      data: {
        date: selectedDate ?? null,
        periodos,
        datos: grouped,
      },
    })
  }
}
