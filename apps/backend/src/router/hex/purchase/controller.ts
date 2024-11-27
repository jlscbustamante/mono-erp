import { badRequest } from '@hapi/boom'
import { type Request, type Response } from 'express'

import { PurchaseUpdaetDto } from '../../../core/inventory/dto'
import { Item } from '../../../core/inventory/entities/item'
import { productItemRepository } from '../../../repositories/inventory/item.repository'
import { catchError } from '../../../utils/decorators'
import { purchaseRepository } from '../dependencies'

export class PurchaseController {
  @catchError
  async updatePurchase(req: Request, res: Response) {
    const purchase = req.body as PurchaseUpdaetDto
    await purchaseRepository.updatePurchase(purchase)
    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async getPurchase(req: Request, res: Response) {
    const { id } = req.query as { id: string }
    const purchase = await purchaseRepository.getPurchase(Number(id))
    if (!purchase) throw badRequest('La compra no existe, id : ', id)
    return res.json({
      message: 'ok',
      data: purchase,
    })
  }

  @catchError
  async getItemsAvailable(req: Request, res: Response) {
    //
    const itemsDb = await productItemRepository.find({
      relations: {
        product: {
          category: true,
        },
        presentation: true,
      },
      order: {
        itemName: 'ASC',
      },
    })
    const items: Item[] = itemsDb.map((el) => ({
      id: el.id,
      categoryName: el.product?.category?.category ?? 'Categoria no definida',
      measureId: el.product?.measureId ?? -1,
      name: el.itemName,
      presentationId: el.presentationId,
      presentationName:
        el.presentation?.presentation ?? 'Presentacion no definida',
      productId: el.productId,
      storePrice: el.unitPrice,
      warehousePrice: el.unitCost,
    }))
    return res.json({
      message: 'ok',
      data: items,
    })
  }

  @catchError
  async getItemsAvailableActive(req: Request, res: Response) {
    //
    const itemsDb = await productItemRepository.find({
      relations: {
        product: {
          category: true,
        },
        presentation: true,
      },
      where: {
        status: 1,
      },
      order: {
        itemName: 'ASC',
      },
    })
    const items: Item[] = itemsDb.map((el) => ({
      id: el.id,
      categoryName: el.product?.category?.category ?? 'Categoria no definida',
      measureId: el.product?.measureId ?? -1,
      name: el.itemName,
      presentationId: el.presentationId,
      presentationName:
        el.presentation?.presentation ?? 'Presentacion no definida',
      productId: el.productId,
      storePrice: el.unitPrice,
      warehousePrice: el.unitCost,
    }))
    return res.json({
      message: 'ok',
      data: items,
    })
  }
}
