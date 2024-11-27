import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Supplier } from '../entities/Supplier'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface SupplierRepository extends Repository<Supplier> {
  filterNt(filters: EnvFilters<Supplier>): Promise<Supplier[]>
}

const supplierRepository = AppDataSource.getRepository(Supplier).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'sucursal.').join(' AND ')
    const query = this.createQueryBuilder('sucursal')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})

export default supplierRepository as SupplierRepository
