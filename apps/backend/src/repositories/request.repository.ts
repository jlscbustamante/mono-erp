import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { RequestEntity } from '../entities/Request'
import { Filter3Method, IUserFilter3 } from '../types/filter'
import { RequestType } from '../types/request'
import { filters3Adapter } from '../utils/filtersAdapter'
import { filter3Base } from './filter3base'

export type RequestRepository = Repository<RequestEntity> & {
  filter3Count(
    filters: IUserFilter3<RequestEntity>,
  ): Promise<{ [key in RequestType]: number }>
  filter3: Filter3Method<RequestEntity>
}

const requestRepository: RequestRepository = AppDataSource.getRepository(
  RequestEntity,
).extend({
  filter3: filter3Base,
  filter3Count: async function (filters) {
    const countTransfer = this.countBy({
      ...filters3Adapter(filters.filters),
      request_type: RequestType.Transfer,
    })
    const countSimple = this.countBy({
      ...filters3Adapter(filters.filters),
      request_type: RequestType.Simple,
    })
    const countLiquidation = this.countBy({
      ...filters3Adapter(filters.filters),
      request_type: RequestType.Liquidation,
    })
    const countSupplier = this.countBy({
      ...filters3Adapter(filters.filters),
      request_type: RequestType.Supplier,
    })
    const [transfer, simple, liquidation, supplier] = await Promise.all([
      countTransfer,
      countSimple,
      countLiquidation,
      countSupplier,
    ])
    return {
      T: transfer,
      S: simple,
      L: liquidation,
      U: supplier,
    }
  },
})

export default requestRepository
