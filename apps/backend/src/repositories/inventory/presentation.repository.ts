import { Repository } from 'typeorm'

import { Presentation } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type PresentationRepository = Repository<Presentation> & {
  filter3: Filter3Method<Presentation>
}

export const presentationRepository: PresentationRepository =
  AppDataSource.getRepository(Presentation).extend({
    filter3: filter3Base,
  })
