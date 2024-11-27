import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Sucursal } from '../entities/Sucursal'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface SucursalRepository extends Repository<Sucursal> {
  filterNt(filters: EnvFilters<Sucursal>): Promise<Sucursal[]>
}

const sucursalRepository = AppDataSource.getRepository(Sucursal).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'sucursal.').join(' AND ')
    const query = this.createQueryBuilder('sucursal')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})

export default sucursalRepository as SucursalRepository
