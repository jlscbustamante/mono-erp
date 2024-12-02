import { Repository } from 'typeorm'

import { IamPermission } from 'pizzadb'
import { AppDataSource } from '../config/database'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamPermissionRepository extends Repository<IamPermission> {
  filterNt(filters: EnvFilters<IamPermission>): Promise<IamPermission[]>
}

const IamPermissionRepository = AppDataSource.getRepository(
  IamPermission,
).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'iamPermission.').join(
      ' AND ',
    )
    const query = this.createQueryBuilder('iamPermission')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})
export default IamPermissionRepository as IamPermissionRepository
