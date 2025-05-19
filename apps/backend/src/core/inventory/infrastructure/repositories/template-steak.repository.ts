import { Equivalance } from '../../../../entities/inventory/Equivalance'
import {
  DispatchUsedTo,
  InvDispatchBase,
} from '../../../../entities/inventory/InvDispatchBase'
import { InvDispatchBaseItem } from '../../../../entities/inventory/InvDispatchBaseItem'
import { cache } from '../../../../lib/cache'
import {
  invDispatchBase,
  invDispatchBaseItemRepository,
} from '../../../../repositories/inventory/dispatchBaseLast.repository'
import { equivalenceRepository } from '../../../../repositories/inventory/equivalence.repository'
import { Equivalence } from '../../entities/equivalence'
import { Item } from '../../entities/item'
import { TemplateRepository } from '../../entities/repositories/template.repository'
import { WarehousesRepository } from '../../entities/repositories/warehouses.repository'
import { Template } from '../../entities/template'
import { TemplateItem } from '../../entities/template_item'

export class TemplateSteakRepository implements TemplateRepository {
  constructor(private readonly warehouseRepository: WarehousesRepository) {}

  async getItemsTemplate(isWarehouse: boolean): Promise<Item[]> {
    const items = await this.getStockItems(isWarehouse)
    return items
  }

  async getTemplates(): Promise<{
    store: TemplateItem[]
    warehouse: TemplateItem[]
  }> {
    const [store, warehouse] = await Promise.all([
      this.getTemplate(false),
      this.getTemplate(true),
    ])

    return {
      store,
      warehouse,
    }
  }

  async getDynamicStockTemplate(warehouseCode: string): Promise<{
    template: Item[]
    isWarehouse: boolean
  }> {
    const isWarehouse =
      await this.warehouseRepository.isWarehouse(warehouseCode)
    const items = await this.getStockItems(isWarehouse)
    return {
      template: items,
      isWarehouse,
    }
  }
  async getDynamicTemplate(warehouseCode: string): Promise<Template> {
    const isWarehouse =
      await this.warehouseRepository.isWarehouse(warehouseCode)

    const items = await this.getTemplate(isWarehouse)
    return { items, isWarehouse }
  }

  async getTemplate(isWarehouse: boolean): Promise<TemplateItem[]> {
    const templatebase = await invDispatchBase.findOne({
      where: {
        // sucursal_type: 'PIZZAM',
        sucursal_type: isWarehouse ? 'PIZZARAUL' : 'STEAKHOUSE',
        used_to: isWarehouse ? DispatchUsedTo.Warehouse : DispatchUsedTo.Store,
      },
    })
    if (!templatebase) {
      if (isWarehouse)
        throw new Error('No se encontro el plantilla base para almacen')
      else throw new Error('No se encontro el plantilla base para tienda')
    }
    const items = await this.dispatchBaseItems(templatebase.id)
    this.validateItems(items)
    const equivalences = await this.equivalences()

    const templateItems: TemplateItem[] = []
    for (const item of items) {
      let equivalence: Equivalence | null = null
      if (item.item_move_id != item.item_stock_id) {
        const equivalenceFinded = equivalences.find(
          (el) =>
            el.presentation_from == item.itemMove.presentationId &&
            el.measure_to == item.itemStock.product?.measureId,
        )
        if (!equivalenceFinded) {
          if (isWarehouse) {
            throw new Error(
              `Almacen: No se encontro una equivalencia entre la presentacion ${item.itemMove.presentation?.presentation} -> ${item.itemStock.product?.measure?.measure}. Item: ${item.item_move_name}`,
            )
          } else {
            throw new Error(
              `Tienda: No se encontro una equivalencia entre la presentacion ${item.itemMove.presentation?.presentation} -> ${item.itemStock.product?.measure?.measure}. Item: ${item.item_move_name}`,
            )
          }
        }
        equivalence = new Equivalence(
          equivalenceFinded.presentation_from,
          equivalenceFinded.measure_to,
          equivalenceFinded.value_from,
          equivalenceFinded.value_factor,
        )
      }
      const itemDispatch: Item = {
        id: item.itemMove.id,
        categoryName:
          item.itemMove.product?.category?.category ?? 'Sin categoría',
        measureId: item.itemMove.product!.measureId,
        name: item.itemMove.itemName,
        presentationId: item.itemMove.presentationId,
        presentationName: item.itemMove.presentation?.presentation ?? '',
        productId: item.itemMove.productId,
        storePrice: item.itemMove.unitPrice,
        warehousePrice: item.itemMove.unitCost,
      }
      const itemStock: Item = {
        id: item.itemStock.id,
        categoryName:
          item.itemStock.product!.category?.category ?? 'Sin categoría',
        measureId: item.itemStock.product!.measureId,
        name: item.itemStock.itemName,
        presentationId: item.itemStock.presentationId,
        presentationName: item.itemStock.presentation?.presentation ?? '',
        productId: item.itemStock.productId,
        storePrice: item.itemStock.unitPrice,
        warehousePrice: item.itemStock.unitCost,
      }
      const itemTemplate = new TemplateItem(
        itemDispatch,
        itemStock,
        equivalence,
      )
      templateItems.push(itemTemplate)
    }

    return templateItems
  }

  private async templatebass() {
    const value = cache.get('templatebass')
    if (value) {
      return value as InvDispatchBase[]
    }
    const templatebass = await invDispatchBase.find()
    cache.set('templatebass', templatebass)
    return templatebass
  }

  private async dispatchBaseItems(id: number): Promise<InvDispatchBaseItem[]> {
    const value = cache.get(`dispatch_base_items_${id}`)
    if (value) {
      return value as InvDispatchBaseItem[]
    } else {
      const items = await invDispatchBaseItemRepository.find({
        where: {
          dispatch_id: id,
        },
        relations: {
          itemMove: {
            presentation: true,
            product: {
              measure: true,
              category: true,
            },
          },
          itemStock: {
            presentation: true,
            product: {
              measure: true,
              category: true,
            },
          },
        },
        order: {
          itemStock: {
            itemName: 'ASC',
            id: 'ASC',
          },
        },
      })
      cache.set(`dispatch_base_items_${id}`, items)
      return items
    }
  }

  private async equivalences(): Promise<Equivalance[]> {
    const cached = cache.get('equivalences')
    if (cached) {
      return cached as Equivalance[]
    }
    const equivalences = await equivalenceRepository.find()
    cache.set('equivalences', equivalences)
    return equivalences
  }

  private validateItems(items: InvDispatchBaseItem[]) {
    for (const item of items) {
      if (!item.itemMove.presentationId) {
        throw new Error(
          `La presentacion no se encuentra registrada en el item ${item.itemStock.itemName}`,
        )
      }
      if (!item.itemStock.product?.measureId) {
        throw new Error(
          `La medida no se encuentra registrada en el producto ${item.itemStock.product?.product}`,
        )
      }
    }
  }

  private async getStockItems(isWarehouse: boolean): Promise<Item[]> {
    // const templatebase = await invDispatchBase.findOne({
    //   where: {
    //     sucursal_type: 'PIZZAM',
    //     used_to: isWarehouse ? DispatchUsedTo.Warehouse : DispatchUsedTo.Store,
    //   },
    // })
    const templatebase = (await this.templatebass()).find((el) => {
      return (
        el.sucursal_type == (isWarehouse ? 'PIZZARAUL' : 'STEAKHOUSE') &&
        el.used_to ==
          (isWarehouse ? DispatchUsedTo.Warehouse : DispatchUsedTo.Store)
      )
    })
    if (!templatebase) {
      if (isWarehouse)
        throw new Error('No se encontro el plantilla base para almacen')
      else throw new Error('No se encontro el plantilla base para tienda')
    }
    const templateItems = await this.dispatchBaseItems(templatebase.id)

    const items: Item[] = templateItems
      .map((el) => {
        if (!el.itemStock) return null
        return {
          id: el.itemStock.id,
          name: el.itemStock.itemName,
          categoryName:
            el.itemStock.product?.category?.category ?? 'Sin categoría',
          measureId: el.itemStock.product!.measureId,
          presentationId: el.itemStock.presentationId,
          presentationName: el.itemStock.presentation?.presentation ?? '',
          productId: el.itemStock.productId,
          storePrice: el.itemStock.unitPrice,
          warehousePrice: el.itemStock.unitCost,
        } satisfies Item
      })
      .filter((el) => el != null) as Item[]

    const uniqueItems = items.reduce((acc, item) => {
      if (!acc.some((el) => el.id == item.id)) acc.push(item)
      return acc
    }, [] as Item[])

    return uniqueItems
  }

  async getStoreStockItems(): Promise<Item[]> {
    const value = cache.get('store_stock_items')
    if (value) {
      return value as Item[]
    }
    const stocktemplate = this.getStockItems(false)
    cache.set('store_stock_items', stocktemplate)
    return stocktemplate
  }
}
