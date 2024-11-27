import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvPurchase } from '../../entities/inventory/Purchase'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvPurchaseRepository = Repository<InvPurchase> & {
  filter3: Filter3Method<InvPurchase>
}

export const invPurchaseRepository: InvPurchaseRepository =
  AppDataSource.getRepository(InvPurchase).extend({
    filter3: filter3Base,
  })
