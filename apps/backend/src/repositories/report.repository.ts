import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { MenuReport } from '../entities/MenuReport'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface ReportRepository extends Repository<MenuReport> {
  filterNt(filters: EnvFilters<MenuReport>): Promise<MenuReport[]>
}

const menuReportRepository = AppDataSource.getRepository(MenuReport).extend({
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'menuReport.').join(
      ' AND ',
    )
    const query = this.createQueryBuilder('menuReport')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})
export default menuReportRepository as ReportRepository
