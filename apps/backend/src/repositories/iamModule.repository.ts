import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { IamModule } from '../entities/IamModule'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamModuleRepository extends Repository<IamModule> {
  filterNt(filters: EnvFilters<IamModule>): Promise<IamModule[]>
}

const IamModuleRepository = AppDataSource.getRepository(IamModule).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'iamModule.').join(' AND ')
    const query = this.createQueryBuilder('iamModule')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})

export default IamModuleRepository as IamModuleRepository
