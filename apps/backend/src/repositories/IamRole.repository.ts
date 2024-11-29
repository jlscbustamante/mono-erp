import { Repository } from 'typeorm'

import { IamRole } from 'pizzadb'
import { AppDataSource } from '../config/database'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamRoleRepository extends Repository<IamRole> {
  filterNt(filters: EnvFilters<IamRole>): Promise<IamRole[]>
}

const IamRoleRepository = AppDataSource.getRepository(IamRole).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'IamRole.').join(' AND ')
    const query = this.createQueryBuilder('IamRole').where(whereClause).select()

    return query.getMany()
  },
})

export default IamRoleRepository as IamRoleRepository
