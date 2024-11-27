import { AppDataSource } from '../config/database'
import { BankReconciliation } from '../entities/BnkReconcilation'
import { EnvFilters } from '../types'
import { filtersAdapterNt } from '../utils/filtersAdapter'

type ConfigFilter = {
  limit?: number
}

export const BankReconciliationRepository = AppDataSource.getRepository(
  BankReconciliation,
).extend({
  async filter(
    conditions: EnvFilters<BankReconciliation>,
    { limit = 500 }: ConfigFilter = {},
  ) {
    const whereClause = filtersAdapterNt(conditions, 'bnk.').join(' AND ')

    return this.createQueryBuilder('bnk')
      .where(whereClause)
      .select()
      .where(whereClause)
      .limit(limit)
      .getMany()
  },
})
