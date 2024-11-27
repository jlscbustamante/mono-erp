import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { Presentation } from '../../entities/inventory/Presentation'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type PresentationRepository = Repository<Presentation> & {
  filter3: Filter3Method<Presentation>
}

export const presentationRepository: PresentationRepository =
  AppDataSource.getRepository(Presentation).extend({
    filter3: filter3Base,
  })
