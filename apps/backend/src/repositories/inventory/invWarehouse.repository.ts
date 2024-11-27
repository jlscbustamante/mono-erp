import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvWarehouse } from '../../entities/inventory/InvWarehouse'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvWarehouseRepository = Repository<InvWarehouse> & {
  filter3: Filter3Method<InvWarehouse>
}

export const invWarehouseRepository: InvWarehouseRepository =
  AppDataSource.getRepository(InvWarehouse).extend({
    filter3: filter3Base,
  })
