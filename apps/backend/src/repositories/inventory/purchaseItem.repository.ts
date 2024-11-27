import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvPurchaseItem } from '../../entities/inventory/PurchaseItem'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvPurchaseItemRepository = Repository<InvPurchaseItem> & {
  filter3: Filter3Method<InvPurchaseItem>
}

export const invPurchaseItemRepository: InvPurchaseItemRepository =
  AppDataSource.getRepository(InvPurchaseItem).extend({
    filter3: filter3Base,
  })
