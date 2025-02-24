import { Equal, Not, Raw, Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CashMove } from '../entities/CashMove'
import { Filters } from '../types'
import { CashMoveStatus } from '../types/cashMove'
import { OpFilter } from '../types/filter'
import {
  filtersAdapterBuilder,
  filtersAdapterNt,
} from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface CashMoveRepository extends Repository<CashMove> {
  filter(filters: Filters<CashMove>): Promise<CashMove[]>
  filterNt(filters: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<CashMove[]>
  getInfoPaymentMethods(
    date: string,
  ): Promise<
    { sucursalcode: string; name: string; izipay: number; online: number }[]
  >
  hasMoves(storeId: number, date: string): Promise<boolean>
}

const cashMoveRepository = AppDataSource.getRepository(CashMove).extend({
  async filter(filters: Filters<CashMove>) {
    const whereClause = filtersAdapterBuilder(filters).join(' AND ')

    return this.createQueryBuilder('cm')
      .where(whereClause)
      .select()
      .leftJoinAndSelect('cm.cashAccount', 'cashAccount')
      .leftJoinAndSelect('cm.category', 'category')
      .getMany()
  },
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'moves.').join(' AND ')

    return this.createQueryBuilder('moves')
      .where(whereClause)
      .select()
      .leftJoinAndSelect('moves.cashAccount', 'cashAccount')
      .leftJoinAndSelect('moves.category', 'category')
      .getMany()
  },
  async getInfoPaymentMethods(date: string): Promise<
    {
      sucursalcode: string
      name: string
      izipay: number
      online: number
      status_online: string
      status_izipay: string
    }[]
  > {
    const info = await this.query(
      'SELECT acm.cash_id,ca.codefis as sucursalcode,ca.name name, SUM(CASE WHEN category_expense_id=13 THEN amount ELSE 0 END) AS izipay,SUM(CASE WHEN category_expense_id=124 THEN amount ELSE 0 END) AS culqui , SUM(CASE WHEN category_expense_id=11 THEN amount ELSE 0 END) AS online,MIN(CASE WHEN category_expense_id = 11 THEN acm.status END) AS status_online, MIN(CASE WHEN category_expense_id = 13 THEN acm.status END) AS status_izipay FROM adm_sucursal_move acm INNER JOIN fin_cashbank ca ON ca.id=acm.cash_id WHERE DATE(requested_at)=? AND acm.status!=? GROUP BY ca.codefis,ca.name ORDER BY ca.codefis ASC',
      [date, CashMoveStatus.Deleted],
    )
    return info
  },
  async hasMoves(storeId: number, date: string): Promise<boolean> {
    const count = await this.count({
      where: {
        requested_at: Raw(() => `DATE(requested_at) = :date`, { date }),
        cash_id: storeId,
        status: Not(Equal(CashMoveStatus.Deleted)),
      },
    })
    if (count > 0) return true
    return false
  },
}) as safeAny

export default cashMoveRepository as CashMoveRepository
