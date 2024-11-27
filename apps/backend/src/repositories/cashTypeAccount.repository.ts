import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CashAccountType } from '../entities/CashAccountType'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface CashTypeAccountRepository extends Repository<CashAccountType> {
  filterTypeNt(filters: EnvFilters<CashAccountType>): Promise<CashAccountType[]>
}

const cashTypeAccountRepository = AppDataSource.getRepository(
  CashAccountType,
).extend({
  async filterTypeNt(conditions: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<CashAccountType[]> {
    const whereClause = filtersAdapterNt(conditions, 'cashAccountType.').join(
      ' AND ',
    )
    const query = this.createQueryBuilder('cashAccountType')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})
export default cashTypeAccountRepository as CashTypeAccountRepository
