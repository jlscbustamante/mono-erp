import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { Product } from '../../entities/inventory/Product'
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
