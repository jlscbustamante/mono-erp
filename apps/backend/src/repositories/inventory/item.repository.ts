import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { Item } from '../../entities/inventory/Item'
import { Filter3Method } from '../../types/filter'
import { filters3Adapter } from '../../utils/filtersAdapter'

export type ProductItemRepository = Repository<Item> & {
  filter3: Filter3Method<Item>
}

export const productItemRepository: ProductItemRepository =
  AppDataSource.getRepository(Item).extend({
    async filter3({ select, filters, pagination, order, relations }): Promise<{
      data: any[]
      count: number
      totalPages: number | undefined
      page?: number
    }> {
      // const filterCategory= filters.find((f) => f.field === 'product.categoryId')
      const filterCategory = filters?.['product.categoryId' as keyof Item]
      let filtersFiltered
      if (filterCategory) {
        const { 'product.categoryId': catteId, ...rest } = filters as any
        filtersFiltered = filters3Adapter(rest)
        filtersFiltered = {
          ...filtersFiltered,
          product: {
            categoryId: catteId[1],
          },
        }
      } else {
        filtersFiltered = filters3Adapter(filters)
      }

      const [data, count] = await this.findAndCount({
        select,
        take: pagination?.lot ?? undefined,
        skip: pagination ? (pagination.page - 1) * pagination.lot : undefined,
        where: filtersFiltered,
        order,
        relations,
      })
      const totalPages = pagination
        ? Math.ceil(count / pagination.lot)
        : undefined
      if (pagination && pagination.page > totalPages!) {
        const [productsSec, countSec] = await this.findAndCount({
          select,
          take: pagination.lot,
          skip: 0,
          where: filters3Adapter(filters),
          order,
          relations,
        })
        return {
          data: productsSec,
          count: countSec,
          totalPages,
          page: 1,
        }
      }

      return {
        data,
        count,
        totalPages,
        page: pagination?.page,
      }
    },
  })
