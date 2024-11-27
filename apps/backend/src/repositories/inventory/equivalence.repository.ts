import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { Equivalance } from '../../entities/inventory/Equivalance'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type EquivalenceRepository = Repository<Equivalance> & {
  filter3: Filter3Method<Equivalance>
}

export const equivalenceRepository: EquivalenceRepository =
  AppDataSource.getRepository(Equivalance).extend({
    filter3: filter3Base,
  })
