import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { IamFunction } from '../entities/IamFuction'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface IamFunctionRepository extends Repository<IamFunction> {
  filterNt(filters: EnvFilters<IamFunction>): Promise<IamFunction[]>
}

const IamFunctionRepository = AppDataSource.getRepository(IamFunction).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'IamFunction.').join(
      ' AND ',
    )
    const query = this.createQueryBuilder('IamFunction')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})

export default IamFunctionRepository as IamFunctionRepository
