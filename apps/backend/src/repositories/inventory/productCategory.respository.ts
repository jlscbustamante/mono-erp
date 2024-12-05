import { Repository } from 'typeorm'

import { ProductCategory } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type ProductCategoryRepository = Repository<ProductCategory> & {
  filter3: Filter3Method<ProductCategory>
}

export const productCategoryRepository: ProductCategoryRepository =
  AppDataSource.getRepository(ProductCategory).extend({
    filter3: filter3Base,
  })
