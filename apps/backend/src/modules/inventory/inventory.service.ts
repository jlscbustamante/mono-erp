import { format, parseISO, sub } from 'date-fns'
import { InvDispatch, InvStock, Item as ItemDb } from 'pizzadb'
import { Raw, Repository } from 'typeorm'
import { StockItemToCreateDto } from '../../core/inventory/dto'
import { STOCK_STATUS } from '../../core/inventory/entities'
import { Item } from '../../core/inventory/entities/item'
import { DispatchUsedTo } from '../../entities/inventory/InvDispatchBase'
import { InvDispatchBaseItem } from '../../entities/inventory/InvDispatchBaseItem'
import { cache, cacheApi, cacheHalfDay } from '../../lib/cache'
import {
  invDispatchBase,
  invDispatchBaseItemRepository,
} from '../../repositories/inventory/dispatchBaseLast.repository'

export class InventoryService {
  constructor(
    private readonly dispatchRepository: Repository<InvDispatch>,
    private readonly stockRepository: Repository<InvStock>,
  ) {}

  async createOrder() {
    const value = cache.get('despacho_683')
    if (value) {
      return value
    }
    const dispatch = await this.dispatchRepository.findOne({
      where: {
        id: 683,
      },
    })
    if (!dispatch) throw new Error('Despacho no encontrado')
    cache.set('despacho_683', dispatch)
    return dispatch
  }

  async getTemplateItems(company = 'PIZZA'): Promise<Item[]> {
    const cached = cacheHalfDay.get(`template_items_v2_${company}`)
    if (cached) return cached as Item[]
    const templatebase = await invDispatchBase.findOne({
      where: {
        sucursal_type: company,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!templatebase) return []
    const templateItems = await invDispatchBaseItemRepository.find({
      select: {
        itemStock: {
          id: true,
          itemName: true,
          product: {
            id: true,
            category: {
              id: true,
              category: true,
            },
            measureId: true,
          },
          presentationId: true,
          presentation: {
            id: true,
            presentation: true,
          },
          productId: true,
          unitPrice: true,
          unitCost: true,
        },
      },
      where: {
        dispatch_id: templatebase.id,
      },
      relations: {
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
        },
      },
    })

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
          presentationName: el.itemStock.presentation.presentation,
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

    cacheHalfDay.set('template_items_v2', uniqueItems)
    return uniqueItems
  }

  /**
   * @description Obtiene template para que el usuario edite lo neceario de una tienda
   */
  async getStockToEdit(store: string, date: string, company?: string) {
    const cached = cacheApi.get(`stock_edit_v2_${store}_${date}`)
    if (cached) return cached as StockItemToCreateDto[]
    const beforeDay = format(sub(parseISO(date), { days: 1 }), 'yyyy-MM-dd')
    const [before, now, template] = await Promise.all([
      this.stockRepository.find({
        where: {
          warehouse_id: store,
          stock_at: Raw((alias) => `DATE(${alias}) = '${beforeDay}'`),
        },
      }),
      this.stockRepository.find({
        where: {
          warehouse_id: store,
          stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
        },
      }),
      this.getTemplateItems(company),
    ])
    const result: StockItemToCreateDto[] = []
    const uniqueIds = getUniqueIds(before, now, template)

    for (const id of uniqueIds) {
      const itemBefore = before.find((el) => el.item_id == id)
      const itemNow = now.find((el) => el.item_id == id)
      const itemTemplate = template.find((el) => el.id == id)

      if (itemTemplate) {
        const stock = getDefaultStock(itemTemplate, date, store)
        let initialStock = 0
        let totalInitial = 0
        if (itemBefore) {
          initialStock = itemBefore.stock_physical
          totalInitial = itemBefore.total_value
        } else if (itemNow) {
          if (before.length == 0) {
            initialStock = itemNow.stock_last
            totalInitial = itemNow.stock_last * itemNow.unit_value
          }
        }
        stock.initialStock = initialStock
        stock.totalInitial = totalInitial
        stock.quantityInDispatch = itemNow?.quantity_in_dp ?? 0
        stock.quantityOutDispatch = itemNow?.quantity_out_dp ?? 0
        stock.quantityInMv = itemNow?.quantity_in_mv ?? 0
        stock.quantityOutMv = itemNow?.quantity_out_mv ?? 0
        stock.quantityInPurchase = itemNow?.quantity_in_pu ?? 0
        stock.stockCurrent = itemNow?.stock_current ?? 0
        stock.stockPhysical = itemNow?.stock_physical ?? 0
        stock.totalValue = itemNow?.total_value ?? 0
        if (itemNow) {
          stock.unitValue = itemNow.unit_value
        }

        result.push(stock)
      } else if (itemBefore) {
        const stock = getDefaultFromOther(itemBefore, date)
        let initialStock = 0
        let totalInitial = 0
        initialStock = itemBefore.stock_physical
        totalInitial = itemBefore.total_value

        stock.initialStock = initialStock
        stock.totalInitial = totalInitial
        stock.quantityInDispatch = itemNow?.quantity_in_dp ?? 0
        stock.quantityOutDispatch = itemNow?.quantity_out_dp ?? 0
        stock.quantityInMv = itemNow?.quantity_in_mv ?? 0
        stock.quantityOutMv = itemNow?.quantity_out_mv ?? 0
        stock.quantityInPurchase = itemNow?.quantity_in_pu ?? 0
        stock.stockCurrent = itemNow?.stock_current ?? 0
        stock.stockPhysical = itemNow?.stock_physical ?? 0
        stock.totalValue = itemNow?.total_value ?? 0
        if (itemNow) {
          stock.unitValue = itemNow.unit_value
        }

        result.push(stock)
      } else if (itemNow) {
        const stock = getDefaultFromOther(itemNow, date)

        stock.initialStock = 0
        stock.totalInitial = 0
        stock.quantityInDispatch = itemNow?.quantity_in_dp ?? 0
        stock.quantityOutDispatch = itemNow?.quantity_out_dp ?? 0
        stock.quantityInMv = itemNow?.quantity_in_mv ?? 0
        stock.quantityOutMv = itemNow?.quantity_out_mv ?? 0
        stock.quantityInPurchase = itemNow?.quantity_in_pu ?? 0
        stock.stockCurrent = itemNow?.stock_current ?? 0
        stock.stockPhysical = itemNow?.stock_physical ?? 0
        stock.totalValue = itemNow?.total_value ?? 0
        stock.unitValue = itemNow.unit_value

        result.push(stock)
      }
    }
    const ordered = result.sort((a, b) => a.itemName.localeCompare(b.itemName))
    cacheApi.set(`stock_edit_v2_${store}_${date}`, ordered)
    return ordered
  }

  async getItemsTemplate(company: string) {
    const cached = cacheHalfDay.get(`template_items_pr_${company}`)
    if (cached) return cached as ItemDb[]
    const templatebase = await invDispatchBase.findOne({
      where: {
        sucursal_type: company,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!templatebase) return []
    const templateItems = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: templatebase.id,
      },
      relations: {
        itemMove: {
          brand: true,
          presentation: true,
          product: {
            measure: true,
            category: true,
          },
        },
      },
      order: {
        item_move_name: 'ASC',
      },
    })
    const itemsMoves = templateItems.map((item) => {
      if (!item.itemMove) return null
      return item.itemMove
    })

    const data = itemsMoves.filter((el) => el) as ItemDb[]
    cacheHalfDay.set(`template_items_pr_${company}`, data)
    return data
  }

  async getLastClosedStock(warehouseCode: string) {
    const stock = await this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.warehouse_id = :warehouseCode', { warehouseCode })
      .andWhere('stock.status = :status', { status: STOCK_STATUS.CLOSED })
      .orderBy('stock.stock_at', 'DESC')
      .limit(1)
      .getOne()

    if (!stock) return []
    const date = stock.stock_at.split(' ')[0]
    const stockDate = await this.stockRepository.find({
      where: {
        warehouse_id: warehouseCode,
        stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
      },
    })
    return stockDate
  }

  async getTemplate(company: string) {
    const cached = cacheHalfDay.get(`template_dispatch_pr_${company}`)
    if (cached) return cached as InvDispatchBaseItem[]
    const templatebase = await invDispatchBase.findOne({
      where: {
        sucursal_type: company,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!templatebase) return []
    const templateItems = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: templatebase.id,
      },
      relations: {
        itemMove: {
          brand: true,
          presentation: true,
          product: {
            measure: true,
            category: true,
          },
        },
      },
      order: {
        item_move_name: 'ASC',
      },
    })

    const data = templateItems.filter((el) => el.itemMove)
    cacheHalfDay.set(`template_dispatch_pr_${company}`, data)
    return data
  }

  async getDispatchTemplate(warehouseCode: string, company: string) {
    const cached = cacheApi.get(`template_dispatch_${warehouseCode}`)
    if (cached) return cached

    const dispatchBase = await this.getTemplate(company)

    const stock = await this.getLastClosedStock(warehouseCode)

    const dispatchTemplate = dispatchBase.map((el) => {
      // const stockItem = stock.find((item) => item.item_id == el.item_)
      // const itemStock = stockItem.itemStock
      const itemDispatch = el.itemMove
      const itemPhysical = stock.find(
        (item) => item.item_id == el.item_stock_id,
      )

      return {
        id: itemDispatch.id,
        name: itemDispatch.itemName,
        measureCode: itemDispatch.product?.measure?.code ?? '',
        measureName: itemDispatch.product?.measure?.measure ?? '',
        unitPrice: itemDispatch.unitPrice,
        presentationId: itemDispatch.presentationId,
        presentation: itemDispatch.presentation.presentation,
        categoryName: itemDispatch.product?.category?.category ?? '',
        lastQuantity: itemPhysical?.stock_physical ?? 0,
        lastQuantityMeasureCode: itemDispatch.product?.measure?.code ?? '',
      } satisfies {
        id: number
        name: string
        measureCode: string
        measureName: string
        unitPrice: number
        presentationId: number
        presentation: string
        categoryName: string
        lastQuantity: number
        lastQuantityMeasureCode: string
      }
    })

    cacheApi.set(`template_dispatch_${warehouseCode}`, dispatchTemplate)
    return dispatchTemplate
  }
}

function getDefaultStock(
  item: Item,
  date: string,
  warehouseCode: string,
): StockItemToCreateDto {
  return {
    createdBy: 'sys',
    itemId: item.id,
    categoryName: item.categoryName,
    itemName: item.name,
    measureId: item.measureId,
    presentationId: item.presentationId,
    presentationName: item.presentationName,
    initialStock: 0,
    totalInitial: 0,
    quantityInDispatch: 0,
    quantityInPurchase: 0,
    quantityOutDispatch: 0,
    quantityOutSale: 0,
    stockCurrent: 0,
    stockPhysical: 0,
    unitValue: item.storePrice,
    totalValue: 0,
    stockAt: date,
    status: STOCK_STATUS.AUTOGENERATED,
    warehouseId: warehouseCode,
    quantityInMv: 0,
    quantityOutMv: 0,
  }
}

function getDefaultFromOther(
  stock: InvStock,
  date: string,
): StockItemToCreateDto {
  return {
    createdBy: 'sys',
    itemId: stock.item_id,
    categoryName: '',
    itemName: stock.item_name,
    measureId: stock.measure_id,
    presentationId: stock.presentation_id,
    presentationName: stock.presentation_name,
    initialStock: 0,
    totalInitial: 0,
    quantityInDispatch: 0,
    quantityInPurchase: 0,
    quantityOutDispatch: 0,
    quantityOutSale: 0,
    stockCurrent: 0,
    stockPhysical: 0,
    unitValue: stock.unit_value,
    totalValue: 0,
    stockAt: date,
    status: STOCK_STATUS.AUTOGENERATED,
    warehouseId: stock.warehouse_id,
    quantityInMv: 0,
    quantityOutMv: 0,
  }
}

function getUniqueIds(
  before: InvStock[],
  today: InvStock[],
  items: Item[],
): number[] {
  const idSet = new Set<number>()

  // Usar un bucle for en lugar de forEach
  for (let i = 0; i < before.length; i++) {
    idSet.add(before[i].item_id)
  }

  for (let i = 0; i < today.length; i++) {
    idSet.add(today[i].item_id)
  }

  for (let i = 0; i < items.length; i++) {
    idSet.add(items[i].id)
  }

  return Array.from(idSet)
}
