import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { AdmFile } from '../entities/AdmFile'
import { Filters } from '../types'
import { OpFilter } from '../types/filter'
import {
  filtersAdapterBuilder,
  filtersAdapterNt,
} from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface AdmFileRepository extends Repository<AdmFile> {
  filters(filters: Filters<AdmFile>): Promise<AdmFile[]>
  filterNt(filters: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<AdmFile[]>
}

const AdmFileRepository = AppDataSource.getRepository(AdmFile).extend({
  async filters(filters: Filters<AdmFile>) {
    const whereClause = filtersAdapterBuilder(filters).join(' AND ')

    return this.createQueryBuilder('admFile').where(whereClause).getMany()
  },

  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'adf.').join(' AND ')

    return this.createQueryBuilder('adf')
      .select(['adf', 'reqalias.id', 'reqalias.description'])
      .leftJoin('adf.requirement', 'reqalias')
      .where(whereClause)
      .getMany()
  },
})

export default AdmFileRepository
