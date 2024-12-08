import { badRequest } from '@hapi/boom'

import { InvStock } from 'pizzadb'
import { AppDataSource } from '../../../config/database'
import { InvPurchase } from '../../../entities/inventory/Purchase'
import { StockItemToCreateDto } from '../dto'
import { Purchase, PURCHASE_STATUS } from '../entities/purchase'
import { ItemRepository } from '../entities/repositories/item.repository'
import { PurchaseRepository } from '../entities/repositories/purchase.repository'
import { StockRepository } from '../entities/repositories/stock.repository'
import { WarehousesRepository } from '../entities/repositories/warehouses.repository'
import { calculateCurrent } from '../entities/util'
import { GenerateTemplateEditStock } from './generate_template_stock'
import { SaveStock } from './save_stock'

export class StorePurchase {
  constructor(
    private readonly generateTemplateStock: GenerateTemplateEditStock,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly saveStock: SaveStock,
    private readonly warehouseRepository: WarehousesRepository,
    private readonly itemRepository: ItemRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  async run(purchaseId: number, user: string) {
    if (!purchaseId) throw badRequest('No se encontro la compra')
    const purchase = await this.purchaseRepository.getPurchase(purchaseId)
    if (!purchase) throw badRequest('No se encontro la compra')
    this.validateData(purchase)
    const date = purchase.purchaseAt.split(' ')[0]
    const warehouseCode: string = purchase.warehouseId!
    const isWarehouse =
      await this.warehouseRepository.isWarehouse(warehouseCode)
    const baseTemplate = await this.generateTemplateStock.templateToReset(
      warehouseCode,
      purchase.purchaseAt,
    )
    const stockToSave: StockItemToCreateDto[] = []
    for (const itemStock of baseTemplate) {
      const itemPurchase = purchase.items.find(
        (el) => el.itemId === itemStock.itemId,
      )
      if (itemPurchase) {
        const purchaseQuantity =
          itemStock.quantityInPurchase + itemPurchase.quantity
        const current = calculateCurrent(isWarehouse, {
          initialStock: itemStock.initialStock,
          quantityInDispatch: itemStock.quantityInDispatch,
          quantityInMv: itemStock.quantityInMv,
          quantityInPurchase: purchaseQuantity,
          quantityOutDispatch: itemStock.quantityOutDispatch,
          quantityOutMv: itemStock.quantityOutMv,
        })

        stockToSave.push({
          ...itemStock,
          quantityInPurchase: purchaseQuantity,
          stockCurrent: current,
          createdBy: user,
        })
      } else {
        stockToSave.push(itemStock)
      }
    }
    const extraItem = await this.getItemsNotTemplate(
      purchase,
      stockToSave.map((el) => el.itemId),
      user,
    )

    stockToSave.push(...extraItem)
    // await this.saveStock.run(stockToSave, purchase.purchaseAt, warehouseCode)
    // await this.purchaseRepository.changePurchaseStatus(
    //   purchase.id,
    //   PURCHASE_STATUS.STORED,
    // )
    const invStocks = this.stockRepository.getInvStockFromStockCreate(
      stockToSave,
      purchase.purchaseAt,
    )
    const cleaned = invStocks.filter((el) => {
      const total =
        el.stock_last +
        Math.abs(el.stock_current) +
        el.quantity_in_dp +
        el.quantity_in_mv +
        el.quantity_in_pu +
        el.quantity_out_dp +
        el.quantity_out_mv +
        el.quantity_out_sl
      return total > 0
    })

    await AppDataSource.transaction(async (manager) => {
      if (cleaned.length > 0) {
        await manager.query(
          `DELETE FROM inv_stock WHERE DATE(stock_at) = ? AND warehouse_id=?`,
          [date, warehouseCode],
        )
        await manager.insert(InvStock, cleaned)
      }
      await manager.update(InvPurchase, purchase.id, {
        status: PURCHASE_STATUS.STORED,
      })
    })

    // await kardexService.generateFromPurchase(purchase.id, user)
  }

  private async getItemsNotTemplate(
    purchase: Purchase,
    checkIds: number[],
    user = 'sys',
  ): Promise<StockItemToCreateDto[]> {
    const items = purchase.items.filter((el) => !checkIds.includes(el.itemId))
    if (items.length > 0) return []
    const itemsDb = await this.itemRepository.getItems(checkIds)
    const stock: StockItemToCreateDto[] = []
    for (const purchaseItem of items) {
      const itemDb = itemsDb.find((el) => el.id == purchaseItem.itemId)
      if (!itemDb) continue

      stock.push({
        itemId: itemDb.id,
        itemName: itemDb.name,
        presentationId: itemDb.presentationId,
        categoryName: itemDb.categoryName,
        createdBy: user,
        initialStock: 0,
        totalInitial: 0,
        measureId: itemDb.measureId,
        presentationName: itemDb.presentationName,
        quantityInDispatch: 0,
        quantityInMv: 0,
        quantityInPurchase: purchaseItem.quantity,
        quantityOutDispatch: 0,
        quantityOutMv: 0,
        quantityOutSale: 0,
        status: 1,
        stockAt: purchase.purchaseAt,
        stockCurrent: purchaseItem.quantity,
        stockPhysical: 0,
        totalValue: 0,
        unitValue: purchaseItem.unitValue,
        warehouseId: purchase.warehouseId,
      } satisfies StockItemToCreateDto)
    }
    return stock
  }

  private validateData(purchase: Purchase) {
    if (!purchase.purchaseAt || purchase.purchaseAt == '') {
      throw new Error('No se encontro la fecha de compra')
    }
    if (purchase.status == PURCHASE_STATUS.STORED) {
      throw new Error('La compra ya fue almacenada')
    }
    if (!purchase.warehouseId || purchase.warehouseId == '') {
      throw new Error('No se encontro el almacen destino en la compra')
    }
    if (purchase.items.length == 0) {
      throw new Error('No se puede registrar un despacho sin items')
    }
    if (purchase.items.some((el) => el.quantity == 0)) {
      throw new Error('La compra tiene items con cantidades 0, eliminelos')
    }
  }
}
