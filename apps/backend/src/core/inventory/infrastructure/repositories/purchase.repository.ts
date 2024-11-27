import { In, Not } from 'typeorm'

import { AppDataSource } from '../../../../config/database'
import { InvPurchase } from '../../../../entities/inventory/Purchase'
import { InvPurchaseItem } from '../../../../entities/inventory/PurchaseItem'
import { invPurchaseRepository } from '../../../../repositories/inventory/purchase.repository'
import { PurchaseUpdaetDto } from '../../dto'
import {
  Purchase,
  PURCHASE_STATUS,
  PurchaseItem,
} from '../../entities/purchase'
import { PurchaseRepository } from '../../entities/repositories/purchase.repository'

export class PurchaseRepositoryImpl implements PurchaseRepository {
  async changePurchaseStatus(
    purchaseId: number,
    status: PURCHASE_STATUS,
  ): Promise<void> {
    await invPurchaseRepository.update({ id: purchaseId }, { status })
  }

  async getPurchase(purchaseId: number): Promise<Purchase | null> {
    const purchaseDb = await invPurchaseRepository.findOne({
      where: {
        id: purchaseId,
      },
      relations: {
        items: true,
      },
    })
    if (!purchaseDb) null
    if (!purchaseDb?.purchaseAt)
      throw new Error(`La compra ${purchaseId} no tiene registrada la fecha`)

    const items: PurchaseItem[] =
      purchaseDb.items?.map((el) => {
        return {
          id: el.id,
          itemId: el.itemId,
          itemName: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentationName,
          purchaseId: el.purchaseId,
          quantity: el.quantity,
          totalValue: el.totalValue,
          unitValue: el.unitValue,
        } satisfies PurchaseItem
      }) ?? []

    const purchase: Purchase = {
      id: purchaseDb.id,
      gloss: purchaseDb?.gloss ?? '',
      supplierId: purchaseDb.supplierId,
      purchaseAt: purchaseDb.purchaseAt.split(' ')[0],
      status: purchaseDb.status as PURCHASE_STATUS,
      warehouseId: purchaseDb.warehouseId ?? '',
      numGuide: purchaseDb.numGuide ?? '',
      numInvoice: purchaseDb.numInvoice ?? '',
      taxValue:
        !purchaseDb.taxValue || purchaseDb.taxValue === 0
          ? null
          : purchaseDb.taxValue,
      discount: purchaseDb.discount ?? 0,
      items,
    }

    return purchase
  }

  async updatePurchase(purchase: PurchaseUpdaetDto): Promise<void> {
    const netValue = purchase.items.reduce((acc, el) => acc + el.totalValue, 0)
    const discount = purchase.discount
    const taxValue = purchase.taxValue ?? 0
    const totalValue = netValue - discount + taxValue
    const itemIds = purchase.items.filter((el) => el.id).map((el) => el.id)
    await AppDataSource.transaction(async (manager) => {
      manager.update(InvPurchase, purchase.id, {
        id: purchase.id,
        gloss: purchase.gloss,
        warehouseId: purchase.warehouseId,
        discount: purchase.discount,
        taxValue: purchase.taxValue ?? 0,
        supplierId: purchase.supplierId,
        numGuide: purchase.numGuide,
        numInvoice: purchase.numInvoice,
        netValue,
        totalValue,
      })
      await manager
        .createQueryBuilder()
        .delete()
        .from(InvPurchaseItem)
        .where({ id: Not(In(itemIds)), purchaseId: purchase.id })
        .execute()
      const allPromises: any[] = []
      for (const item of purchase.items) {
        if (item.id) {
          allPromises.push(manager.update(InvPurchaseItem, item.id, item))
        } else {
          allPromises.push(manager.insert(InvPurchaseItem, item))
        }
      }
      await Promise.all(allPromises)
    })
  }
}
