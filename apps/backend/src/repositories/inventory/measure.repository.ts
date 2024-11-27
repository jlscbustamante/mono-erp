import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { Measure } from '../../entities/inventory/Measure'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type MeasureRepository = Repository<Measure> & {
  filter3: Filter3Method<Measure>
}

export const measureRepository: MeasureRepository = AppDataSource.getRepository(
  Measure,
).extend({
  filter3: filter3Base,
})
