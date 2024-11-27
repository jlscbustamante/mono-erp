import { In, Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Category } from '../entities/Category'
import { EnvFilters } from '../types'
import { CategoryStatus, CategoryTypeId } from '../types/category'
import { Filter3Method, IUserFilter3, OpFilter } from '../types/filter'
import { filters3Adapter, filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'
import { filter3Base } from './filter3base'

export interface CategoryRepository extends Repository<Category> {
  filterNt(filters: EnvFilters<Category>): Promise<Category[]>
  filter3: Filter3Method<Category>
  forStore(): Promise<Category[]>
}

const categoryRepository = AppDataSource.getRepository(Category).extend({
  async filterNt(conditions: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<Category[]> {
    const whereClauseAccount = filtersAdapterNt(conditions, 'account.')
    const whereClause = filtersAdapterNt(conditions, 'cashAccount.').join(
      ' AND ',
    )
    const combinedWhereClause = [whereClauseAccount, whereClause]
      .filter(Boolean)
      .join(' AND ')

    const query = this.createQueryBuilder('cashAccount')
      .leftJoin('cashAccount.account', 'account')
      .where(combinedWhereClause)
      .select()

    return query.getMany()
  },
  filter3: async function (_filters: IUserFilter3<Category>) {
    const { select, filters, order, relations } = _filters

    const whereBuilded = filters3Adapter(filters)
    let finalWhere: any
    if (whereBuilded.account_id) {
      finalWhere = [whereBuilded]
      const newWhere = Object.assign({}, whereBuilded)
      delete newWhere.account_id
      const secondOr = {
        ...newWhere,
        account: { ...filters3Adapter({ account: filters.account_id }) },
      }
      finalWhere.push(secondOr)
    }
    console.log(finalWhere ? finalWhere : whereBuilded)

    const [products] = await this.findAndCount({
      select,
      where: finalWhere ? finalWhere : whereBuilded,
      order,
      relations,
    })

    return { data: products }
  },
  forStore() {
    return this.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([
            CategoryTypeId.Bank,
            CategoryTypeId.Standard,
            CategoryTypeId.Store,
            CategoryTypeId.Multiple,
          ]),
        },
      },
      order: {
        name: 'ASC',
      },
    })
  },
})

export default categoryRepository as unknown as CategoryRepository
