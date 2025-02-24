import { In, Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CashAccount } from '../entities/CashAccount'
import { EnvFilters } from '../types'
import { CashAccountStatus, CashAccountTypeId } from '../types/cashAccount'
import { Filter3Method, IUserFilter3, OpFilter } from '../types/filter'
import { filters3Adapter, filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface CashAccountRepository extends Repository<CashAccount> {
  filterNt(filters: EnvFilters<CashAccount>): Promise<CashAccount[]>
  filter3: Filter3Method<CashAccount>
  getStores(): Promise<CashAccount[]>
}

const cashAccountRepository = AppDataSource.getRepository(CashAccount).extend({
  async filterNt(conditions: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<CashAccount[]> {
    const whereClauseAccount = filtersAdapterNt(conditions, 'account.')
    const whereClause = filtersAdapterNt(conditions, 'cashAccount.').join(
      ' AND ',
    )
    const combinedWhereClause = [whereClauseAccount, whereClause]
      .filter(Boolean)
      .join(' AND ')

    const query = this.createQueryBuilder('cashAccount')
      .leftJoin('cashAccount.account', 'fin_account')
      .where(combinedWhereClause)
      .select()

    return query.getMany()
  },
  filter3: async function (_filters: IUserFilter3<CashAccount>) {
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

    const [products] = await this.findAndCount({
      select,
      where: finalWhere ? finalWhere : whereBuilded,
      order,
      relations,
    })

    return { data: products }
  },
  async getStores() {
    return this.find({
      where: {
        status: CashAccountStatus.Active,
        cash_account_type: {
          type_id: In([CashAccountTypeId.Store]),
        },
      },
      order: {
        name: 'ASC',
      },
      relations: { cash_account_type: true },
    })
  },
})

export default cashAccountRepository as unknown as CashAccountRepository
