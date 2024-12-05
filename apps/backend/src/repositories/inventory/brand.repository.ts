import { Repository } from 'typeorm'

import { Brand } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type BrandRepository = Repository<Brand> & {
  filter3: Filter3Method<Brand>
}

export const brandRepository: BrandRepository = AppDataSource.getRepository(
  Brand,
).extend({
  filter3: filter3Base,
})
