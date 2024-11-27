import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CashBalance } from '../entities/CashBalance'
import { safeAny } from '../utils/someAny'

export interface CashBalanceRepository extends Repository<CashBalance> {
  findOneByDate(date: string, cashId: number): Promise<CashBalance | null>
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const cashBalanceRepository: CashBalanceRepository =
  AppDataSource.getRepository(CashBalance).extend({
    async findOneByDate(
      date: string,
      cashId: number,
    ): Promise<CashBalance | null> {
      return this.createQueryBuilder('c_b')
        .where('c_b.cash_account_id= :cashId', { cashId })
        .andWhere('DATE(c_b.balance_at) = :date', { date })
        .getOne()
    },
  }) as safeAny

export default cashBalanceRepository
