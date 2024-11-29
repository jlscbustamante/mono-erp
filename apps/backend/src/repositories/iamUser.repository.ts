import { Repository } from 'typeorm'

import { IamUser } from 'pizzadb'
import { AppDataSource } from '../config/database'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamUserRepository extends Repository<IamUser> {
  filterNt(filters: EnvFilters<IamUser>): Promise<IamUser[]>
}

const IamUserRepository = AppDataSource.getRepository(IamUser).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'IamUser.').join(' AND ')
    const query = this.createQueryBuilder('IamUser').where(whereClause).select()

    return query.getMany()
  },
})

export default IamUserRepository as IamUserRepository
