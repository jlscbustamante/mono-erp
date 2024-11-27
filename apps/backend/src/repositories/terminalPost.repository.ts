import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { TerminalPost } from '../entities/TerminalPost'
import { EnvFilters } from '../types'
import { Filter3Method, OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'
import { filter3Base } from './filter3base'

export interface TerminalPostRepository extends Repository<TerminalPost> {
  filterNt(filters: EnvFilters<TerminalPost>): Promise<TerminalPost[]>
  filter3: Filter3Method<TerminalPost>
  getStores(): Promise<TerminalPost[]>
}

const terminalPostRepository = AppDataSource.getRepository(TerminalPost).extend(
  {
    async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
      const whereClause = filtersAdapterNt(conditions, 'terminalPost.').join(
        ' AND ',
      )
      const query = this.createQueryBuilder('terminalPost')
        .where(whereClause)
        .select()

      return query.getMany()
    },
    filter3: filter3Base,
  },
)
export default terminalPostRepository as TerminalPostRepository
