import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CategoryType } from '../entities/CategoryType'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface CategoryTypeRepository extends Repository<CategoryType> {
  filterNt(filters: EnvFilters<CategoryType>): Promise<CategoryType[]>
}

const categoryTypeRepository = AppDataSource.getRepository(CategoryType).extend(
  {
    async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
      const whereClause = filtersAdapterNt(conditions, 'categoryType.').join(
        ' AND ',
      )
      const query = this.createQueryBuilder('categoryType')
        .where(whereClause)
        .select()

      return query.getMany()
    },
  },
)
export default categoryTypeRepository as CategoryTypeRepository
