import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { InvDispatchItem } from '../../entities/inventory/DispatchItems'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvDispatchItemRepository = Repository<InvDispatchItem> & {
  filter3: Filter3Method<InvDispatchItem>
}

export const invDispatchItemRepository: InvDispatchItemRepository =
  AppDataSource.getRepository(InvDispatchItem).extend({
    filter3: filter3Base,
  })
