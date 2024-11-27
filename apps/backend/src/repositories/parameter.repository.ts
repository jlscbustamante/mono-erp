import { In, Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Parameter } from '../entities/Parameter'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'
import { filtersAdapterNt } from '../utils/filtersAdapter'
import { safeAny } from '../utils/someAny'

export interface ParameterRepository extends Repository<Parameter> {
  filterNt(filters: EnvFilters<Parameter>): Promise<Parameter[]>
  getMultipleAccount(value: (string | number)[]): Promise<Parameter[]>
}

const parameterRepository = AppDataSource.getRepository(Parameter).extend({
  async getMultipleAccount(value: (string | number)[]): Promise<Parameter[]> {
    return this.find({
      where: {
        type: 'ASIENTO_MULTIPLE',
        value: In(value),
      },
    })
  },
  async filterNt(conditions: { [key: string]: [OpFilter, ...safeAny[]] }) {
    const whereClause = filtersAdapterNt(conditions, 'parameter.').join(' AND ')
    const query = this.createQueryBuilder('parameter')
      .where(whereClause)
      .select()

    return query.getMany()
  },
})

export default parameterRepository as ParameterRepository
