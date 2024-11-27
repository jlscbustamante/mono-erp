import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CostCenter } from '../entities/CostCenter'
import { EnvFilters } from '../types'
import { Filter3Method, OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'
import { filter3Base } from './filter3base'

export interface CostCenterRepository extends Repository<CostCenter> {
  filterNt(filters: EnvFilters<CostCenter>): Promise<CostCenter[]>
  filter3: Filter3Method<CostCenter>
}

const costCenterRepository = AppDataSource.getRepository(CostCenter).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'costCenter.').join(
      ' AND ',
    )
    const query = this.createQueryBuilder('costCenter')
      .where(whereClause)
      .select()

    return query.getMany()
  },
  filter3: filter3Base,
})
export default costCenterRepository as CostCenterRepository
