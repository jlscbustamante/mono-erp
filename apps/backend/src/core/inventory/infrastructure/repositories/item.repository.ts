import { In } from 'typeorm'

import { productItemRepository } from '../../../../repositories/inventory/item.repository'
import { StatusEntityNumber } from '../../../../types'
import { Item } from '../../entities/item'
import { ItemRepository } from '../../entities/repositories/item.repository'

export class ItemRepositoryImpl implements ItemRepository {
  async getItems(ids: number[]): Promise<Item[]> {
    const items = await productItemRepository.find({
      where: { id: In(ids) },
      relations: {
        product: {
          measure: true,
          category: true,
        },
        presentation: true,
      },
    })
    //
    // return items.map()
    return items.map(
      (el) =>
        ({
          id: el.id,
          categoryName: el.product?.category?.category ?? '',
          measureId: el.product?.measureId ?? -1,
          name: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentation?.presentation ?? '',
          productId: el.productId,
          storePrice: el.unitPrice,
          warehousePrice: el.unitCost,
        }) satisfies Item,
    )
  }
  async getActiveItems(): Promise<Item[]> {
    const items = await productItemRepository.find({
      where: {
        status: StatusEntityNumber.Active,
      },
      order: {
        itemName: 'ASC',
      },
      relations: {
        product: {
          measure: true,
          category: true,
        },
        presentation: true,
      },
    })
    return items.map(
      (el) =>
        ({
          id: el.id,
          categoryName: el.product?.category?.category ?? '',
          measureId: el.product?.measureId ?? -1,
          name: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentation?.presentation ?? '',
          productId: el.productId,
          storePrice: el.unitPrice,
          warehousePrice: el.unitCost,
        }) satisfies Item,
    )
  }

  async getAllItems(): Promise<Item[]> {
    const items = await productItemRepository.find({
      order: {
        itemName: 'ASC',
      },
      relations: {
        product: {
          measure: true,
          category: true,
        },
        presentation: true,
      },
    })
    return items.map(
      (el) =>
        ({
          id: el.id,
          categoryName: el.product?.category?.category ?? '',
          measureId: el.product?.measureId ?? -1,
          name: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentation?.presentation ?? '',
          productId: el.productId,
          storePrice: el.unitPrice,
          warehousePrice: el.unitCost,
        }) satisfies Item,
    )
  }
}
