import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { ProductCategory } from '../../entities/inventory/ProductCategory'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

export type ProductCategoryRepository = Repository<ProductCategory> & {
  filter3: Filter3Method<ProductCategory>
}

export const productCategoryRepository: ProductCategoryRepository =
  AppDataSource.getRepository(ProductCategory).extend({
    filter3: filter3Base,
  })
