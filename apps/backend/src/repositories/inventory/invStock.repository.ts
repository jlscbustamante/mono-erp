import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvStock } from '../../entities/inventory/InvStock'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvStockRepository = Repository<InvStock> & {
  filter3: Filter3Method<InvStock>
}

export const invStockRepository: InvStockRepository =
  AppDataSource.getRepository(InvStock).extend({
    filter3: filter3Base,
  })
