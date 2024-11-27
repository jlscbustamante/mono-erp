import { badRequest } from '@hapi/boom'
import { Request, Response } from 'express'

import config from '../../config/config'
import { AppDataSource } from '../../config/database'
import { AccoutingItem } from '../../entities/AccoutingItem'
import { AccoutingMove } from '../../entities/AccoutingMove'
import { Item } from '../../entities/inventory/Item'
import { Product } from '../../entities/inventory/Product'
import { InvPurchase } from '../../entities/inventory/Purchase'
import { InvSupplier } from '../../entities/inventory/Supplier'
import { RequestEntity } from '../../entities/Request'
import { brandRepository } from '../../repositories/inventory/brand.repository'
import { invDispatchBaseItemRepository } from '../../repositories/inventory/dispatchBaseLast.repository'
import { invDispatchItemRepository } from '../../repositories/inventory/dispatchItem.repository'
import { productItemRepository } from '../../repositories/inventory/item.repository'
import { measureRepository } from '../../repositories/inventory/measure.repository'
import { presentationRepository } from '../../repositories/inventory/presentation.repository'
import { productRepository } from '../../repositories/inventory/product.repository'
import { productCategoryRepository } from '../../repositories/inventory/productCategory.respository'
import { invPurchaseRepository } from '../../repositories/inventory/purchase.repository'
import { invPurchaseItemRepository } from '../../repositories/inventory/purchaseItem.repository'
import { invSupplierRepository } from '../../repositories/inventory/supplier.repository'
import { IToken, StatusEntityNumber } from '../../types'
import { IUserFilter3 } from '../../types/filter'
import { RequestStatus } from '../../types/request'
import { catchError } from '../../utils/decorators'
import { PurchaseController } from './purchase.controller'

export class ProductController {
  @catchError
  async getProducts(req: Request, res: Response): Promise<void> {
    const filters: IUserFilter3<Product> = req.body
    const {
      data: products,
      count,
      totalPages,
    } = await productRepository.filter3(filters)

    res.json({
      data: {
        products,
        totalPages,
        count,
      },
    })
  }

  @catchError
  async editProduct(req: Request, res: Response): Promise<void> {
    const product = req.body
    const productoriginal = await productRepository.findOne({
      where: { id: product.id },
    })
    if (!productoriginal) throw badRequest('Producto no encontrado')

    if (productoriginal.product != product.product) {
      const items = await productItemRepository.find({
        where: {
          productId: product.id,
        },
      })
      const renamed = items.map((item) => {
        const originalname = item.itemName
        const splited = originalname.split('-')
        splited[0] = product.product + ' '
        const newname = splited.join('-')

        return {
          ...item,
          itemName: newname,
        }
      })

      await AppDataSource.transaction(async (manager) => {
        await manager.update(Product, product.id, product)
        const promised = []
        for (const item of renamed) {
          promised.push(
            manager.update(Item, item.id, { itemName: item.itemName }),
          )
        }
        await Promise.all(promised)
      })
    } else {
      await productRepository.update(product.id, product)
    }

    res.json({
      message: 'Actualizado correctamente',
    })
  }

  @catchError
  async editProductItem(req: Request, res: Response): Promise<void> {
    const product = req.body
    delete product.brand
    delete product.presentation
    delete product.supplier
    await productItemRepository.update(product.id, product)

    res.json({
      message: 'Actualizado correctamente',
    })
  }

  @catchError
  async createProduct(req: Request, res: Response): Promise<void> {
    const product: Product = req.body
    if (!product.status) product.status = StatusEntityNumber.Inactive
    await productRepository.insert(product)

    res.json({ message: 'Producto creado' })
  }

  @catchError
  async createMeasure(req: Request, res: Response) {
    const measure = req.body
    const result = await measureRepository.insert(measure)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async categories(req: Request, res: Response): Promise<void> {
    const categories = await productCategoryRepository.find({
      where: {
        status: StatusEntityNumber.Active,
      },
    })

    res.json({ data: categories })
  }

  @catchError
  async filterProductItems(req: Request, res: Response): Promise<void> {
    const filters: IUserFilter3<Item> = req.body
    const {
      data: items,
      count,
      totalPages,
    } = await productItemRepository.filter3(filters)
    res.json({
      data: {
        items,
        totalPages,
        count,
      },
    })
  }

  @catchError
  async createCategory(req: Request, res: Response) {
    const category = req.body
    const result = await productCategoryRepository.insert(category)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async createBrand(req: Request, res: Response) {
    const brand = req.body
    const result = await brandRepository.insert(brand)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async getBrands(req: Request, res: Response): Promise<void> {
    const brands = await brandRepository.find({
      where: {
        status: StatusEntityNumber.Active,
      },
    })

    res.json({ data: brands })
  }

  @catchError
  async getSuppliers(req: Request, res: Response): Promise<void> {
    const brands = await invSupplierRepository.find({
      order: {
        supplier: 'ASC',
      },
    })

    res.json({ data: brands })
  }

  @catchError
  async getPresentations(req: Request, res: Response): Promise<void> {
    const presentations = await presentationRepository.find({
      where: {
        status: StatusEntityNumber.Active,
      },
    })

    res.json({ data: presentations })
  }

  @catchError
  async createPresentation(req: Request, res: Response) {
    const presentation = req.body
    const result = await presentationRepository.insert(presentation)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.body
    try {
      await productRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await productRepository.update(id, { status: 0 })
        return res.json({
          message: 'Producto deshabilitado',
        })
      } else {
        throw err
      }
    }

    res.json({
      message: 'Producto eliminado',
    })
  }

  @catchError
  async deleteItem(req: Request, res: Response) {
    const { id } = req.body

    const [countDispatch, countPurchase, countInTemplate] = await Promise.all([
      invDispatchItemRepository.count({
        where: {
          itemId: id,
        },
      }),
      invPurchaseItemRepository.count({
        where: {
          itemId: id,
        },
      }),
      invDispatchBaseItemRepository.count({
        where: [
          {
            item_move_id: id,
          },
          {
            item_stock_id: id,
          },
        ],
      }),
    ])

    if (countInTemplate > 0) {
      throw badRequest(
        'Item usado en una plantilla. Eliminelo primero de la plantilla',
      )
    }

    if (countDispatch == 0 && countPurchase == 0) {
      await productItemRepository.delete(id)
      return res.json({
        message: 'Item eliminado',
      })
    } else {
      await productItemRepository.update(id, { status: 0 })
      return res.json({
        message: 'Item deshabilitado',
      })
    }
  }

  @catchError
  async getOneProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const product = await productRepository.findOneBy({ id: Number(id) })
    res.json({ data: product })
  }

  @catchError
  async getOneProductItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const product = await productItemRepository.findOne({
      where: { id: Number(id) },
      relations: {
        brand: true,
        presentation: true,
        supplier: true,
      },
    })
    res.json({ data: product })
  }

  @catchError
  async measures(req: Request, res: Response): Promise<void> {
    const measures = await measureRepository.find({
      where: {
        status: StatusEntityNumber.Active,
      },
    })

    res.json({ data: measures })
  }

  @catchError
  async createProductItem(req: Request, res: Response) {
    const product = req.body
    const result = await productItemRepository.insert(product)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async createSupplier(req: Request, res: Response) {
    const supplier = req.body
    const result = await invSupplierRepository.insert(supplier)
    res.json({
      message: 'Creado correctamente',
      data: { id: result.raw.insertId },
    })
  }

  @catchError
  async updateSupplier(req: Request, res: Response) {
    const data = req.body as InvSupplier

    const supplier = await invSupplierRepository.findOne({
      where: {
        id: data.id,
      },
    })
    if (!supplier) throw badRequest('Proveedor no encontrado')

    if (supplier.supplier != data.supplier) {
      const items = await productItemRepository.find({
        where: {
          supplierId: supplier.id,
        },
      })

      const renamed = items.map((item) => {
        const originalname = item.itemName
        const splited = originalname.split('-')
        splited[1] = ' ' + data.supplier.trim() + ' '
        const newname = splited.join('-')

        return {
          ...item,
          itemName: newname,
        }
      })

      await AppDataSource.transaction(async (manager) => {
        await manager.update(InvSupplier, data.id, data)
        // await manager.update(Product, supplier.id, supplier)
        const promised = []
        for (const item of renamed) {
          promised.push(
            manager.update(Item, item.id, { itemName: item.itemName }),
          )
        }
        await Promise.all(promised)
      })
    } else {
      await invSupplierRepository.update(data.id, data)
    }

    res.json({
      message: 'Actualizado correctamente',
    })
  }

  @catchError
  async deleteSupplier(req: Request, res: Response) {
    const { id } = req.body
    try {
      await invSupplierRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await invSupplierRepository.update(id, { status: 0 })
        return res.json({
          message: 'Proveedor deshabilitado',
        })
      } else {
        throw err
      }
    }

    res.json({
      message: 'Proveedor eliminado',
    })
  }

  @catchError
  async deletePurchase(req: Request, res: Response) {
    const { id } = req.body
    const token: IToken = req.headers.token as unknown as IToken
    // await invSupplierRepository.update(id, { status: 0 })
    const purchase: InvPurchase | null = await invPurchaseRepository.findOne({
      where: {
        id: id,
      },
    })
    if (!purchase) return res.json({ message: 'No se encontro la compra' })

    if (!config.purchasegeneratederivate) {
      // await invPurchaseRepository.update(id, { status: 9 })
      await AppDataSource.transaction(async (manager) => {
        await manager.update(InvPurchase, id, { status: 9 })
      })
      return res.json({
        message: 'Compra anulada',
      })
    }

    const { itemCredit, itemDebit, move } =
      await PurchaseController.getAccoutingObjects(purchase, token)

    // dar vuelta
    move.gloss = `ANULADO : ${move.gloss}`
    move.move_id = id
    itemCredit.amount_credit = itemDebit.amount_credit
    itemCredit.amount_debit = itemDebit.amount_debit

    itemDebit.amount_credit = itemCredit.amount_debit
    itemDebit.amount_debit = itemCredit.amount_credit

    // await invPurchaseRepository.update(id, { status: 9 })
    // const {} =await PurchaseController.getAccoutingObjects()

    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(AccoutingMove, move)
      itemCredit.move_id = result.raw.insertId
      itemDebit.move_id = result.raw.insertId
      await manager.insert(AccoutingItem, [itemCredit, itemDebit])
      await manager.update(
        RequestEntity,
        { purchaseId: id, status: RequestStatus.Pending },
        { status: RequestStatus.Rejected },
      )

      await manager.update(InvPurchase, id, { status: 9 })
    })

    res.json({
      message: 'Compra anulada',
    })
  }
}
