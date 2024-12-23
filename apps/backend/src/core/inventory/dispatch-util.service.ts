import { eachDayOfInterval, format, parseISO, sub } from 'date-fns'
import {
  DispatchType,
  InvDispatch,
  InvDispatchItem,
  InvStock,
  Item,
} from 'pizzadb'
import { In, Raw, Repository, UpdateQueryBuilder } from 'typeorm'
import { AppDataSource } from '../../config/database'
import { InvPurchase } from '../../entities/inventory/Purchase'
import sucursalRepository from '../../repositories/sucursal.repository'
import { KARDEX_ORIGIN } from '../common/dto'
import { kardexService } from '../common/instances'
import {
  DispatchCreateDto,
  DispatchItemAddDto,
  MoveBetweenStoresDto,
} from './dto'
import { STOCK_STATUS } from './entities'
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchItem,
} from './entities/dispatch'
import { PURCHASE_STATUS } from './entities/purchase'
import { TemplateRepository } from './entities/repositories/template.repository'
import { Template } from './entities/template'

interface DispatchUpdate {
  dispatchId: number
  toCreate: DispatchItemAddDto[]
  toUpdate: DispatchItem[]
  toDelete: DispatchItem[]
  taxValue: number
}

interface ItemRelation {
  itemId: number
  quantity: number
}

interface Relation {
  from: ItemRelation[]
  to: ItemRelation[]
}

export class DispatchUtil {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly dispatchRepository: Repository<InvDispatch>,
    private readonly invStockRepository: Repository<InvStock>,
    private readonly purchaseRepository: Repository<InvPurchase>,
    private readonly itemRepository: Repository<Item>,
  ) {}

  async resetDispatch(dispatchId: number) {
    const { stock, date, sucursales } =
      await this.getRemovedDispatch(dispatchId)
    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        'DELETE FROM inv_kardex WHERE move_type=? AND move_id=?',
        [KARDEX_ORIGIN.DISPATCH, dispatchId],
      )

      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at) = ? AND warehouse_id IN (?)',
        [date, sucursales],
      )
      await manager.insert(InvStock, stock)
      await manager.query('UPDATE inv_dispatch SET status = ? WHERE id = ?', [
        DISPATCH_STATUS.NEW,
        dispatchId,
      ])
    })
  }

  async resetAndDeleteDispatch(dispatchId: number) {
    const { stock, date, sucursales } =
      await this.getRemovedDispatch(dispatchId)
    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        'DELETE FROM inv_kardex WHERE move_type=? AND move_id=?',
        [KARDEX_ORIGIN.DISPATCH, dispatchId],
      )

      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at) = ? AND warehouse_id IN (?)',
        [date, sucursales],
      )
      await manager.insert(InvStock, stock)
      // await manager.delete(InvDispatch, { id: dispatchId })
      await manager.query('UPDATE inv_dispatch SET status = ? WHERE id = ?', [
        DISPATCH_STATUS.CANCELLED,
        dispatchId,
      ])
    })
  }

  async updateDispatched(data: DispatchUpdate, username: string) {
    const { dispatchId } = data
    const dispatch = await this.dispatchRepository.findOne({
      where: {
        id: dispatchId,
      },
      relations: {
        items: true,
      },
    })
    if (!dispatch) throw new Error('Despacho no encontrado')
    const date = dispatch.moveAt.split(' ')[0]

    const getStock = (storeCode: string | null, date: string) =>
      storeCode
        ? this.invStockRepository.find({
            where: {
              warehouse_id: storeCode,
              stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
            },
          })
        : Promise.resolve([])

    const [from, to] = await Promise.all([
      getStock(dispatch.wareFromId, date),
      getStock(dispatch.wareToId, date),
    ])

    const getTemplate = (storeCode: string | null) =>
      storeCode
        ? this.templateRepository.getDynamicTemplate(storeCode)
        : Promise.resolve({ items: [], isWarehouse: false } satisfies Template)

    const [templateFrom, templateTo] = await Promise.all([
      getTemplate(dispatch.wareFromId),
      getTemplate(dispatch.wareToId),
    ])

    const { from: relationsFrom, to: relationsTo } =
      await this.generateCountDispatchedWT(dispatch, {
        templateFrom,
        templateTo,
      })

    const { newDispatch, newItems } = await this.modifyDispatch(dispatch, data)

    // verificar si en newItems hay duplicados de item_id
    const itemsIds = newItems.map((el) => el.itemId)
    const duplicated = itemsIds.filter((el, i) => itemsIds.indexOf(el) != i)
    if (duplicated.length > 0) {
      throw new Error(
        'No puedes tener items duplicados en el despacho: ' +
          duplicated.join(', '),
      )
    }

    const newStockFrom = dispatch.wareFromId
      ? this.removeStockFromWarehouse(from, relationsFrom)
      : []
    const newStockTo = dispatch.wareToId
      ? this.removeStockFromStore(to, relationsTo)
      : []

    const finalStockFrom = this.addDispatchStockWarehouse(
      newStockFrom,
      templateFrom,
      newItems,
      date,
      dispatch.wareFromId,
    )

    const finalStockTo = this.addDispatchStockStore(
      newStockTo,
      templateTo,
      newItems,
      date,
      dispatch.wareToId,
    )

    const invStocks = [...finalStockFrom, ...finalStockTo]

    const cleanInvStocks = invStocks.filter((el) => {
      const total =
        el.quantity_in_dp +
        el.quantity_out_dp +
        el.quantity_in_mv +
        el.quantity_out_mv +
        el.quantity_out_sl +
        Math.abs(el.stock_current) +
        el.stock_last +
        el.stock_physical +
        el.quantity_in_pu
      return total > 0
    })

    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        'DELETE FROM inv_kardex WHERE move_type=? AND move_id=?',
        [KARDEX_ORIGIN.DISPATCH, dispatchId],
      )

      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id IN (?)',
        [date, [dispatch.wareFromId, dispatch.wareToId].filter((el) => el)],
      )

      await manager.insert(InvStock, cleanInvStocks)
      await manager.update(InvDispatch, { id: dispatchId }, newDispatch)
      await manager.delete(InvDispatchItem, { dispatchId })
      await manager.insert(InvDispatchItem, newItems)
    })

    await kardexService.generateFromDispatch(dispatchId, username)
  }

  async storePurchase(purchaseId: number, username: string) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: purchaseId,
      },
      relations: {
        items: true,
      },
    })

    if (!purchase) throw new Error('Compra no encontrado')
    if (!purchase.items || purchase.items.length == 0)
      throw new Error('No se puede almacenar una compra sin items')
    if (!purchase.warehouseId)
      throw new Error(
        'No se puede almacenar una compra sin almacen seleccionado',
      )

    const date = purchase.purchaseAt.split(' ')[0]

    const stocks = await this.invStockRepository.find({
      where: {
        stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
        warehouse_id: purchase.warehouseId,
      },
    })
    const isClosed = stocks.some(
      (el) => el.status == (STOCK_STATUS.CLOSED as any),
    )
    const stockRecord: Record<number, InvStock> = stocks.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )

    const items = await this.itemRepository.find({
      where: {
        id: In(purchase.items.map((el) => el.itemId)),
      },
      relations: {
        product: {
          category: true,
        },
        presentation: true,
      },
    })

    for (const purchaseItem of purchase.items) {
      const item = items.find((el) => el.id == purchaseItem.itemId)
      if (!item) throw new Error('Item no encontrado ' + purchaseItem.itemId)
      const originalStock = stockRecord[purchaseItem.itemId]
      if (originalStock) {
        originalStock.quantity_in_pu =
          originalStock.quantity_in_pu + purchaseItem.quantity
        originalStock.stock_current += purchaseItem.quantity
      } else {
        const newStock = new InvStock()
        newStock.item_id = item.id
        newStock.item_name = item.itemName
        newStock.warehouse_id = purchase.warehouseId
        newStock.categoryName = item.product?.category?.category ?? ''
        newStock.presentation_id = item.presentationId
        newStock.stock_at = date
        newStock.presentation_name = item.presentation.presentation ?? ''
        newStock.measure_id = item.measureId
        newStock.status = isClosed
          ? STOCK_STATUS.CLOSED
          : (STOCK_STATUS.AUTOGENERATED as any)
        newStock.unit_value = item.unitCost
        newStock.quantity_in_pu = purchaseItem.quantity
        newStock.stock_current = purchaseItem.quantity

        stockRecord[item.id] = newStock
      }
    }

    const finalStocks = Object.values(stockRecord)

    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvPurchase,
        { id: purchaseId },
        {
          status: PURCHASE_STATUS.STORED,
          createdBy: username,
        },
      )
      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
        [date, purchase.warehouseId],
      )
      await manager.insert(InvStock, finalStocks)
    })
  }

  async revertStorePurchase(purchaseId: number) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: purchaseId,
      },
      relations: {
        items: true,
      },
    })

    if (!purchase) throw new Error('Compra no encontrado')
    if (!purchase.items || purchase.items.length == 0)
      throw new Error('No se puede almacenar una compra sin items')
    if (!purchase.warehouseId)
      throw new Error(
        'No se puede almacenar una compra sin almacen seleccionado',
      )

    const date = purchase.purchaseAt.split(' ')[0]

    const stocks = await this.invStockRepository.find({
      where: {
        stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
        warehouse_id: purchase.warehouseId,
      },
    })

    const stockRecord: Record<number, InvStock> = stocks.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )

    for (const purchaseItem of purchase.items) {
      const originalStock = stockRecord[purchaseItem.itemId]
      if (originalStock) {
        originalStock.quantity_in_pu =
          originalStock.quantity_in_pu - purchaseItem.quantity
        originalStock.stock_current =
          originalStock.stock_current - purchaseItem.quantity
      }
    }

    const finalStocks = Object.values(stockRecord)

    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvPurchase,
        { id: purchaseId },
        { status: PURCHASE_STATUS.NEW },
      )
      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
        [date, purchase.warehouseId],
      )
      await manager.insert(InvStock, finalStocks)
    })
  }

  async modifyDispatch(original: InvDispatch, dispatch: DispatchUpdate) {
    const { items = [], ...originalDispatch } = original
    const deleteItemsIds = dispatch.toDelete.map((el) => el.id)
    let newItems: InvDispatchItem[] = items.filter(
      (el) => !deleteItemsIds.includes(el.id),
    )
    newItems = newItems.map((el) => {
      const update = dispatch.toUpdate.find((i) => i.itemId === el.itemId)
      if (update) {
        return {
          ...el,
          quantity: update.quantity,
          totalValue: el.unitValue * update.quantity,
        } as InvDispatchItem
      }
      return el
    })
    for (const createItem of dispatch.toCreate) {
      const newInvDispatchItem = new InvDispatchItem()
      newInvDispatchItem.dispatchId = original.id
      newInvDispatchItem.itemId = createItem.itemId
      newInvDispatchItem.itemName = createItem.itemName
      newInvDispatchItem.presentationId = createItem.presentationId
      newInvDispatchItem.presentationName = createItem.presentationName
      newInvDispatchItem.unitValue = createItem.unitValue
      newInvDispatchItem.quantity = createItem.quantity
      newInvDispatchItem.totalValue = createItem.unitValue * createItem.quantity
      newInvDispatchItem.measureId = createItem.measureId

      if (!newItems.find((el) => el.itemId == createItem.itemId))
        newItems.push(newInvDispatchItem)
    }
    const total = newItems.reduce((acc, el) => acc + el.totalValue, 0)
    const newDispatch = {
      ...originalDispatch,
      netValue: total,
      totalValue: total + original.taxValue,
    }
    newItems = newItems.map((el) => {
      return {
        ...el,
        id: null,
      } as any as InvDispatchItem
    })

    return {
      newItems,
      newDispatch,
    }
  }

  async getRemovedDispatch(dispatchId: number) {
    const dispatch = await this.dispatchRepository.findOne({
      where: {
        id: dispatchId,
      },
      relations: {
        items: true,
      },
    })
    if (!dispatch) throw new Error('Despacho no encontrado')
    const date = dispatch.moveAt.split(' ')[0]

    // const { from, to } = await this.generateCountDispatched(dispatch)
    // const [from, to] = await Promise.all([
    //   this.generateTemplateEditStock.templateToReset(dispatch.wareFromId, date),
    //   this.generateTemplateEditStock.templateToReset(dispatch.wareToId, date),
    // ])

    const getStock = (storeCode: string | null, date: string) =>
      storeCode
        ? this.invStockRepository.find({
            where: {
              warehouse_id: storeCode,
              stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
            },
          })
        : Promise.resolve([])

    const [from, to] = await Promise.all([
      getStock(dispatch.wareFromId, date),
      getStock(dispatch.wareToId, date),
    ])

    const { from: relationsFrom, to: relationsTo } =
      await this.generateCountDispatched(dispatch)

    const newStockFrom = dispatch.wareFromId
      ? this.removeStockFromWarehouse(from, relationsFrom)
      : []
    const newStockTo = dispatch.wareToId
      ? this.removeStockFromStore(to, relationsTo)
      : []

    const invStocks: InvStock[] = [...newStockFrom, ...newStockTo]

    const cleanInvStocks = invStocks.filter((el) => {
      const total =
        el.quantity_in_dp +
        el.quantity_out_dp +
        el.quantity_in_mv +
        el.quantity_out_mv +
        el.quantity_out_sl +
        Math.abs(el.stock_current) +
        el.stock_last +
        el.stock_physical +
        el.quantity_in_pu
      return total > 0
    })

    return {
      stock: cleanInvStocks,
      date: date,
      sucursales: [dispatch.wareFromId, dispatch.wareToId].filter((el) => el),
    }
  }

  removeStockFromWarehouse(stock: InvStock[], relations: ItemRelation[]) {
    const newStock: InvStock[] = []
    for (const item of stock) {
      const relation = relations.find((el) => el.itemId == item.item_id)
      if (!relation) {
        newStock.push(item)
      } else {
        newStock.push({
          ...item,
          quantity_out_dp: item.quantity_out_dp - relation.quantity,
          stock_current: item.stock_current + relation.quantity,
        })
      }
    }
    return newStock
  }

  addDispatchStockWarehouse(
    stock: InvStock[],
    template: Template,
    items: InvDispatchItem[],
    date: string,
    warehouseId: string,
  ): InvStock[] {
    const newStock = stock.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )
    for (const itemTemplate of template.items) {
      const itemDispatch = items.find(
        (el) => el.itemId == itemTemplate.itemDispatchId,
      )
      if (itemDispatch) {
        const quantity = itemTemplate.getStockQuantity(itemDispatch?.quantity)
        if (newStock[itemTemplate.itemStockId]) {
          newStock[itemTemplate.itemStockId].quantity_out_dp += quantity
          newStock[itemTemplate.itemStockId].stock_current -= quantity
        } else {
          const itemStock = itemTemplate.getItemStock()
          const newStockItem: InvStock = new InvStock()
          newStockItem.item_id = itemTemplate.itemStockId
          newStockItem.item_name = itemStock.name
          newStockItem.categoryName = itemStock.categoryName
          newStockItem.measure_id = itemStock.measureId
          newStockItem.presentation_id = itemStock.presentationId
          newStockItem.presentation_name = itemStock.presentationName
          newStockItem.stock_current = quantity * -1
          newStockItem.quantity_out_dp = quantity
          newStockItem.stock_last = 0
          newStockItem.stock_physical = 0
          newStockItem.stock_at = date
          newStockItem.warehouse_id = warehouseId
          newStockItem.total_value = 0
          newStockItem.unit_value = itemStock.warehousePrice
          newStockItem.created_by = 'sys'

          newStock[itemTemplate.itemStockId] = newStockItem
        }
      }
    }

    return Object.values(newStock)
  }

  addDispatchMoveStoreOut(
    stock: InvStock[],
    template: Template,
    items: InvDispatchItem[],
    date: string,
    warehouseId: string,
  ): InvStock[] {
    const newStock = stock.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )
    const trackedItemIds:number[]=[]
    for (const itemTemplate of template.items) {
      const itemDispatch = items.find(
        (el) => el.itemId == itemTemplate.itemStockId,
      )
      if (itemDispatch && !trackedItemIds.includes(itemDispatch.itemId)) {
        trackedItemIds.push(itemDispatch.itemId)
        const quantity = itemDispatch.quantity
        if (newStock[itemTemplate.itemStockId]) {
          newStock[itemTemplate.itemStockId].quantity_out_mv += quantity
          newStock[itemTemplate.itemStockId].stock_current -= quantity
        } else {
          const itemStock = itemTemplate.getItemStock()
          const newStockItem: InvStock = new InvStock()
          newStockItem.item_id = itemTemplate.itemStockId
          newStockItem.item_name = itemStock.name
          newStockItem.categoryName = itemStock.categoryName
          newStockItem.measure_id = itemStock.measureId
          newStockItem.presentation_id = itemStock.presentationId
          newStockItem.presentation_name = itemStock.presentationName
          newStockItem.stock_current = quantity * -1
          newStockItem.quantity_out_mv = quantity
          newStockItem.quantity_out_dp = 0
          newStockItem.stock_last = 0
          newStockItem.stock_physical = 0
          newStockItem.stock_at = date
          newStockItem.warehouse_id = warehouseId
          newStockItem.total_value = 0
          newStockItem.unit_value = itemStock.warehousePrice
          newStockItem.created_by = 'sys'

          newStock[itemTemplate.itemStockId] = newStockItem
        }
      }
    }

    return Object.values(newStock)
  }

  addDispatchMoveStoreIn(
    stock: InvStock[],
    template: Template,
    items: InvDispatchItem[],
    date: string,
    warehouseId: string,
  ): InvStock[] {
    const newStock = stock.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )

    const trackedItemIds: number[]=[]
    for (const itemTemplate of template.items) {
      const itemDispatch = items.find(
        (el) => el.itemId == itemTemplate.itemStockId,
      )
      if (itemDispatch && !trackedItemIds.includes(itemDispatch.itemId)) {
        trackedItemIds.push(itemDispatch.itemId)
        const quantity = itemDispatch.quantity
        if (newStock[itemTemplate.itemStockId]) {
          newStock[itemTemplate.itemStockId].quantity_in_mv += quantity
          newStock[itemTemplate.itemStockId].stock_current += quantity
        } else {
          const itemStock = itemTemplate.getItemStock()
          const newStockItem: InvStock = new InvStock()
          newStockItem.item_id = itemTemplate.itemStockId
          newStockItem.item_name = itemStock.name
          newStockItem.categoryName = itemStock.categoryName
          newStockItem.measure_id = itemStock.measureId
          newStockItem.presentation_id = itemStock.presentationId
          newStockItem.presentation_name = itemStock.presentationName
          newStockItem.stock_current = quantity
          newStockItem.quantity_in_mv = quantity
          newStockItem.quantity_out_dp = 0
          newStockItem.stock_last = 0
          newStockItem.stock_physical = 0
          newStockItem.stock_at = date
          newStockItem.warehouse_id = warehouseId
          newStockItem.total_value = 0
          newStockItem.unit_value = itemStock.warehousePrice
          newStockItem.created_by = 'sys'

          newStock[itemTemplate.itemStockId] = newStockItem
        }
      }
    }

    return Object.values(newStock)
  }
  addDispatchStockStore(
    stock: InvStock[],
    template: Template,
    items: InvDispatchItem[],
    date: string,
    warehouseId: string,
  ): InvStock[] {
    const newStock = stock.reduce(
      (acc, el) => {
        acc[el.item_id] = el
        return acc
      },
      {} as Record<number, InvStock>,
    )
    for (const itemTemplate of template.items) {
      const itemDispatch = items.find(
        (el) => el.itemId == itemTemplate.itemDispatchId,
      )
      if (itemDispatch) {
        const quantity = itemTemplate.getStockQuantity(itemDispatch.quantity)
        if (newStock[itemTemplate.itemStockId]) {
          newStock[itemTemplate.itemStockId].quantity_in_dp += quantity
          newStock[itemTemplate.itemStockId].stock_current += quantity
        } else {
          const itemStock = itemTemplate.getItemStock()
          const newStockItem: InvStock = new InvStock()
          newStockItem.item_id = itemTemplate.itemStockId
          newStockItem.item_name = itemStock.name
          newStockItem.categoryName = itemStock.categoryName
          newStockItem.measure_id = itemStock.measureId
          newStockItem.presentation_id = itemStock.presentationId
          newStockItem.presentation_name = itemStock.presentationName
          newStockItem.stock_current = quantity
          newStockItem.quantity_in_dp = quantity
          newStockItem.stock_last = 0
          newStockItem.stock_physical = 0
          newStockItem.stock_at = date
          newStockItem.warehouse_id = warehouseId
          newStockItem.total_value = 0
          newStockItem.unit_value = itemStock.storePrice
          newStockItem.created_by = 'sys'

          newStock[itemTemplate.itemStockId] = newStockItem
        }
      }
    }

    return Object.values(newStock)
  }

  removeStockFromStore(stock: InvStock[], relations: ItemRelation[]) {
    const newStock: InvStock[] = []
    for (const item of stock) {
      const relation = relations.find((el) => el.itemId == item.item_id)
      if (!relation) {
        newStock.push(item)
      } else {
        newStock.push({
          ...item,
          quantity_in_dp: item.quantity_in_dp - relation.quantity,
          stock_current: item.stock_current - relation.quantity,
        })
      }
    }
    return newStock
  }

  async generateCountDispatched(dispatch: InvDispatch): Promise<Relation> {
    const getTemplate = (storeCode: string | null) =>
      storeCode
        ? this.templateRepository.getDynamicTemplate(storeCode)
        : Promise.resolve({ items: [], isWarehouse: false } satisfies Template)

    const [templateFrom, templateTo] = await Promise.all([
      getTemplate(dispatch.wareFromId),
      getTemplate(dispatch.wareToId),
      // this.templateRepository.getDynamicTemplate(dispatch.wareFromId),
      // this.templateRepository.getDynamicTemplate(dispatch.wareToId),
    ])

    const relationsFrom: ItemRelation[] = []
    const relationsTo: ItemRelation[] = []

    for (const item of dispatch?.items ?? []) {
      const itemTemplateFrom = templateFrom?.items?.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      const itemTemplateTo = templateTo?.items?.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplateFrom) {
        relationsFrom.push({
          itemId: itemTemplateFrom.itemStockId,
          quantity: itemTemplateFrom.getStockQuantity(item.quantity),
        })
      } else {
        relationsFrom.push({
          itemId: item.itemId,
          quantity: item.quantity,
        })
      }
      if (itemTemplateTo) {
        relationsTo.push({
          itemId: itemTemplateTo.itemStockId,
          quantity: itemTemplateTo.getStockQuantity(item.quantity),
        })
      } else {
        relationsTo.push({
          itemId: item.itemId,
          quantity: item.quantity,
        })
      }
    }

    return {
      from: relationsFrom,
      to: relationsTo,
    }
  }

  async generateCountDispatchedWT(
    dispatch: InvDispatch,
    {
      templateFrom,
      templateTo,
    }: { templateFrom: Template; templateTo: Template },
  ): Promise<Relation> {
    const relationsFrom: ItemRelation[] = []
    const relationsTo: ItemRelation[] = []

    for (const item of dispatch?.items ?? []) {
      const itemTemplateFrom = templateFrom?.items?.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      const itemTemplateTo = templateTo?.items?.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplateFrom) {
        relationsFrom.push({
          itemId: itemTemplateFrom.itemStockId,
          quantity: itemTemplateFrom.getStockQuantity(item.quantity),
        })
      } else {
        relationsFrom.push({
          itemId: item.itemId,
          quantity: item.quantity,
        })
      }
      if (itemTemplateTo) {
        relationsTo.push({
          itemId: itemTemplateTo.itemStockId,
          quantity: itemTemplateTo.getStockQuantity(item.quantity),
        })
      } else {
        relationsTo.push({
          itemId: item.itemId,
          quantity: item.quantity,
        })
      }
    }

    return {
      from: relationsFrom,
      to: relationsTo,
    }
  }

  async fixTotalLast(warehouseId: string, date: string) {
    const dates: string[] = eachDayOfInterval({
      start: parseISO(date),
      end: new Date(),
    }).map((el) => format(el, 'yyyy-MM-dd'))
    const warehouse = await sucursalRepository.findOne({
      where: {
        id: warehouseId,
      },
    })
    if (!warehouse) throw new Error('Tienda ' + warehouseId + ' no encontrada')

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const beforeDate = format(sub(parseISO(date), { days: 1 }), 'yyyy-MM-dd')

      const [stocks, beforeStock] = await Promise.all([
        AppDataSource.query(
          'select * from inv_stock where warehouse_id=? and DATE(stock_at)=?',
          [warehouse.id, date],
        ),
        AppDataSource.query(
          'select * from inv_stock where warehouse_id=? and DATE(stock_at)=?',
          [warehouse.id, beforeDate],
        ),
      ])

      const relationItemTotal: Record<
        number,
        {
          total: number
          quantity: number
        }
      > = {}

      for (const stock of stocks) {
        const inBefore = beforeStock.find(
          (el: any) => el.item_id == stock.item_id,
        )

        if (inBefore) {
          relationItemTotal[stock.id] = {
            total: inBefore.total_value,
            quantity: inBefore.stock_physical,
          }
        } else {
          const initial = Number(stock.unit_value) * Number(stock.stock_last)

          if (initial > 0)
            relationItemTotal[stock.id] = {
              total: initial,
              quantity: stock.stock_last,
            }
        }
      }
      // TODO: si existe ayer pero no hoy, crearlo
      // for (const before of beforeStock) {
      //   const existNow = stocks.find((el: any) => el.item_id == before.item_id)
      //   if (!existNow) {
      //     const clone = Object.assign({}, before)
      //     clone.stock_at = date
      //     clone.quantity_in_dp = 0
      //     clone.quantity_out_dp = 0
      //     clone.quantity_in_mv = 0
      //     clone.quantity_out_mv = 0
      //     clone.quantity_out_sl = 0
      //     clone.stock_current = before.stock_physical
      //     clone.stock_last = before.stock_physical
      //     clone.total_last = before.total_value
      //     clone.stock_physical = 0
      //     clone.total_value = 0
      //     clone.created_by = 'sys'
      //     clone.updated_by = 'sys'
      //     clone.id = null
      //   }
      // }

      if (Object.keys(relationItemTotal).length > 0) {
        AppDataSource.transaction(async (manager) => {
          const batched: UpdateQueryBuilder<any>[] = []
          for (const stockId in relationItemTotal) {
            const query = manager
              .createQueryBuilder()
              .update('inv_stock')
              .set({
                total_last: relationItemTotal[stockId]?.total ?? 0,
                stock_last: relationItemTotal[stockId]?.quantity ?? 0,
              })
              .where('id = :id', { id: Number(stockId) })
            batched.push(query)
          }
          await Promise.all(batched.map((el) => el.execute()))
        })
      }
    }
  }

  /**
   *
   * @description Para despachos excepcionales(de almacen a tienda)
   */
  async saveDispatchException(dispatch: DispatchCreateDto, user: string) {
    let isAvailable = true
    if (dispatch.wareFromId && dispatch.wareToId) {
      if (dispatch.wareFromId === dispatch.wareToId) {
        isAvailable = false
      }
    } else {
      if (!dispatch.wareFromId && !dispatch.wareToId) {
        isAvailable = false
      }
    }
    if (dispatch.items.length == 0)
      throw new Error('No se puede crear un despacho sin items')
    if (!isAvailable)
      throw new Error('Verifique el origen y destino del movimiento')

    const getTemplate = (storeCode: string | null) =>
      storeCode
        ? this.templateRepository.getDynamicTemplate(storeCode)
        : Promise.resolve({ items: [], isWarehouse: false } satisfies Template)

    const [templateFrom, templateTo] = await Promise.all([
      getTemplate(dispatch.wareFromId),
      getTemplate(dispatch.wareToId),
    ])

    const newDispatch = new InvDispatch()
    newDispatch.approvedBy = user
    newDispatch.createdBy = user
    newDispatch.moveAt = dispatch.dispatchAt
    newDispatch.status = DISPATCH_STATUS.DISPATCHED as any
    newDispatch.numInvoice = dispatch.numInvoice
    newDispatch.numGuide = dispatch.numGuide
    newDispatch.taxValue = dispatch.taxValue
    newDispatch.moveType = DispatchType.Exceptional
    newDispatch.wareFromId = dispatch.wareFromId ?? ''
    newDispatch.wareToId = dispatch.wareToId ?? ''

    const items: InvDispatchItem[] = []
    for (const item of dispatch.items) {
      const newItem = new InvDispatchItem()
      newItem.itemId = item.itemId
      newItem.itemName = item.itemName
      newItem.presentationId = item.presentationId
      newItem.presentationName = item.presentationName
      newItem.measureId = item.measureId
      newItem.quantity = item.quantity
      newItem.unitValue = item.unitValue
      newItem.totalValue = item.quantity * item.unitValue

      items.push(newItem)
    }
    const netvalue = items.reduce((acc, el) => acc + el.totalValue, 0)
    newDispatch.netValue = netvalue
    newDispatch.totalValue = netvalue + dispatch.taxValue
    newDispatch.items = items

    const getStock = (storecode: string | null, date: string) =>
      storecode
        ? this.invStockRepository.find({
            where: {
              warehouse_id: storecode,
              stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
            },
          })
        : Promise.resolve([])

    const [stockFrom, stockTo] = await Promise.all([
      getStock(dispatch.wareFromId, dispatch.dispatchAt.split(' ')[0]),
      getStock(dispatch.wareToId, dispatch.dispatchAt.split(' ')[0]),
    ])

    const newStockFrom = dispatch.wareFromId
      ? this.addDispatchStockWarehouse(
          stockFrom,
          templateFrom,
          items,
          dispatch.dispatchAt.split(' ')[0],
          dispatch.wareFromId,
        )
      : []
    const newStockTo = dispatch.wareToId
      ? this.addDispatchStockStore(
          stockTo,
          templateTo,
          items,
          dispatch.dispatchAt.split(' ')[0],
          dispatch.wareToId,
        )
      : []

    const invStocks = [...newStockFrom, ...newStockTo]
    const cleaned = invStocks.filter((el) => !this.isStockEmpty(el))

    await AppDataSource.transaction(async (manager) => {
      if (dispatch.wareFromId) {
        await manager.query(
          'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
          [dispatch.dispatchAt.split(' ')[0], dispatch.wareFromId],
        )
      }
      if (dispatch.wareToId) {
        await manager.query(
          'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
          [dispatch.dispatchAt.split(' ')[0], dispatch.wareToId],
        )
      }

      const { items: _items, ...restDispatch } = newDispatch
      const result = await manager.insert(InvDispatch, restDispatch)
      const insertId = result.raw.insertId
      await manager.insert(
        InvDispatchItem,
        items.map((el) => ({ ...el, dispatchId: insertId })),
      )
      await manager.insert(
        InvStock,
        cleaned.map((el) => ({ ...el, id: null }) as any),
      )
    })
  }

  private validateDispatch(dispatch: DispatchCreateDto) {
    if (!dispatch.wareFromId || dispatch.wareFromId == '') {
      throw new Error('Completa el Origen del despacho')
    }
    if (!dispatch.wareToId || dispatch.wareToId == '') {
      throw new Error('Completa el Destino del despacho')
    }
    if (dispatch.items.length == 0) {
      throw new Error('No se puede crear un despacho sin items')
    } else if (dispatch.items.some((el) => el.quantity == 0)) {
      throw new Error('El despacho tiene items con cantidades 0, eliminelos')
    }
    if (!dispatch.dispatchAt) {
      throw new Error('Completa la fecha del despacho')
    }
  }

  private isStockEmpty(invStock: InvStock): boolean {
    const total =
      invStock.stock_last +
      invStock.stock_physical +
      Math.abs(invStock.stock_current) +
      invStock.quantity_in_dp +
      invStock.quantity_out_dp +
      invStock.quantity_in_mv +
      invStock.quantity_out_mv +
      invStock.quantity_out_sl +
      invStock.quantity_in_pu
    return total == 0
  }

  async saveMoveBetweenStores(move: MoveBetweenStoresDto, user: string) {
    const template = await this.templateRepository.getTemplate(false)

    const dispatch = new InvDispatch()
    dispatch.approvedBy = user
    dispatch.wareToId = move.storeToId
    dispatch.wareFromId = move.storeFrom
    dispatch.moveAt = move.moveAt
    dispatch.gloss = move.gloss
    dispatch.status = DISPATCH_STATUS.DISPATCHED as any
    dispatch.moveType = DISPATCH_MOVE_TYPE.STORE_TO_STORE as any

    const items: InvDispatchItem[] = []
    for (const item of move.items) {
      const itemTemplate = template.find((el) => el.itemStockId == item.itemId)
      if (itemTemplate) {
        const itemStock = itemTemplate.getItemStock()

        const newItem = new InvDispatchItem()
        newItem.itemId = itemStock.id
        newItem.itemName = itemStock.name
        newItem.presentationId = itemStock.presentationId
        newItem.presentationName = itemStock.presentationName
        newItem.measureId = itemStock.measureId
        newItem.quantity = item.quantity
        newItem.unitValue = itemStock.storePrice
        newItem.totalValue = item.quantity * itemStock.storePrice

        items.push(newItem)
      }
    }
    const netValue = items.reduce((acc, el) => acc + el.totalValue, 0)
    dispatch.netValue = netValue
    dispatch.taxValue = 0
    dispatch.totalValue = netValue

    const [stockFrom, stockTo] = await Promise.all([
      this.invStockRepository.find({
        where: {
          warehouse_id: move.storeFrom,
          stock_at: Raw((alias) => `DATE(${alias}) = '${move.moveAt}'`),
        },
      }),
      this.invStockRepository.find({
        where: {
          warehouse_id: move.storeToId,
          stock_at: Raw((alias) => `DATE(${alias}) = '${move.moveAt}'`),
        },
      }),
    ])

    const newStockFrom = this.addDispatchMoveStoreOut(
      stockFrom,
      {
        items: template,
        isWarehouse: false,
      },
      items,
      move.moveAt.split(' ')[0],
      move.storeFrom,
    )
    const newStockTo = this.addDispatchMoveStoreIn(
      stockTo,
      {
        items: template,
        isWarehouse: false,
      },
      items,
      move.moveAt.split(' ')[0],
      move.storeToId,
    )

    const invStocks = [...newStockFrom, ...newStockTo]
    const cleaned = invStocks.filter((el) => !this.isStockEmpty(el))

    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
        [move.moveAt.split(' ')[0], move.storeFrom],
      )
      await manager.query(
        'DELETE FROM inv_stock WHERE DATE(stock_at)=? AND warehouse_id=?',
        [move.moveAt.split(' ')[0], move.storeToId],
      )

      const { items: _items, ...restDispatch } = dispatch
      const result = await manager.insert(InvDispatch, restDispatch)
      const insertId = result.raw.insertId
      await manager.insert(
        InvDispatchItem,
        items.map((el) => ({ ...el, dispatchId: insertId })),
      )
      await manager.insert(
        InvStock,
        cleaned.map((el) => ({ ...el, id: null }) as any),
      )
    })
  }
}
