import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { IamLog } from '../entities/IamLog'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamLogRepository extends Repository<IamLog> {
  filterNt(filters: EnvFilters<IamLog>): Promise<IamLog[]>
}

const IamLogRepository = AppDataSource.getRepository(IamLog).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'iamLog.').join(' AND ')
    const query = this.createQueryBuilder('iamLog').where(whereClause).select()

    return query.getMany()
  },
})

export default IamLogRepository as IamLogRepository
