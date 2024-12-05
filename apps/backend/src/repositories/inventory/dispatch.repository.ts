import { Repository } from 'typeorm'

import { InvDispatch } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type InvDispatchRepository = Repository<InvDispatch> & {
  filter3: Filter3Method<InvDispatch>
}

export const invDispatchRepository: InvDispatchRepository =
  AppDataSource.getRepository(InvDispatch).extend({
    filter3: filter3Base,
  })
