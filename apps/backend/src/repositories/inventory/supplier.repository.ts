import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvSupplier } from '../../entities/inventory/Supplier'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvSupplierRepository = Repository<InvSupplier> & {
  filter3: Filter3Method<InvSupplier>
}

export const invSupplierRepository: InvSupplierRepository =
  AppDataSource.getRepository(InvSupplier).extend({
    filter3: filter3Base,
  })
