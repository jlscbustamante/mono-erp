import { Repository } from 'typeorm'

import { Product } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type ProductRepository = Repository<Product> & {
  filter3: Filter3Method<Product>
}

export const productRepository: ProductRepository = AppDataSource.getRepository(
  Product,
).extend({
  filter3: filter3Base,
})
