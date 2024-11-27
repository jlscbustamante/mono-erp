import { badRequest, notFound } from '@hapi/boom'
import { type Request, type Response } from 'express'

import { AppDataSource } from '../../config/database'
import { Brand } from '../../entities/inventory/Brand'
import { DispatchUsedTo } from '../../entities/inventory/InvDispatchBase'
import { InvDispatchBaseItem } from '../../entities/inventory/InvDispatchBaseItem'
import { Item } from '../../entities/inventory/Item'
import { Presentation } from '../../entities/inventory/Presentation'
import { brandRepository } from '../../repositories/inventory/brand.repository'
import {
  invDispatchBase,
  invDispatchBaseItemRepository,
} from '../../repositories/inventory/dispatchBaseLast.repository'
import { equivalenceRepository } from '../../repositories/inventory/equivalence.repository'
import { productItemRepository } from '../../repositories/inventory/item.repository'
import { measureRepository } from '../../repositories/inventory/measure.repository'
import { presentationRepository } from '../../repositories/inventory/presentation.repository'
import { productCategoryRepository } from '../../repositories/inventory/productCategory.respository'
import { catchError } from '../../utils/decorators'

export class MaintenanceController {
  @catchError
  async listBrand(req: Request, res: Response) {
    const brands = await brandRepository.find({
      order: {
        id: 'DESC',
      },
    })
    res.json({
      data: brands,
    })
  }

  @catchError
  async createBrand(req: Request, res: Response) {
    const brand = await brandRepository.insert(req.body)
    res.json({
      brand: brand,
    })
  }

  @catchError
  async updateBrand(req: Request, res: Response) {
    const brandoriginal = await brandRepository.findOne({
      where: {
        id: req.body.id,
      },
    })
    if (!brandoriginal) throw notFound('No se encontro la marca')

    const brandupdate = req.body

    if (brandoriginal.brand != req.body.brand) {
      const items = await productItemRepository.find({
        where: {
          brandId: brandupdate.id,
        },
      })
      const renamed = items.map((item) => {
        const originalname = item.itemName
        const splited = originalname.split('-')
        splited[2] = ' ' + brandupdate.brand + ' '
        const newname = splited.join('-')

        return {
          ...item,
          itemName: newname,
        }
      })

      await AppDataSource.transaction(async (manager) => {
        await manager.update(Brand, brandupdate.id, brandupdate)
        const promised = []
        for (const item of renamed) {
          promised.push(
            manager.update(Item, item.id, { itemName: item.itemName }),
          )
        }
        await Promise.all(promised)
      })
    } else {
      await brandRepository.update(req.body.id, brandupdate)
    }

    res.json({
      brand: brandupdate,
    })
  }

  @catchError
  async deleteBrand(req: Request, res: Response) {
    const { id } = req.body
    try {
      await brandRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await brandRepository.update(id, {
          status: 0,
        })
        return res.json({
          message: 'Marca deshabilitada',
        })
      } else {
        throw err
      }
    }
    res.json({
      message: 'Marca eliminada',
    })
  }

  @catchError
  async listPresentation(req: Request, res: Response) {
    const presentation = await presentationRepository.find({
      order: {
        id: 'DESC',
      },
    })
    res.json({
      data: presentation,
    })
  }

  @catchError
  async createPresentation(req: Request, res: Response) {
    const presentation = await presentationRepository.insert(req.body)
    res.json({
      brand: presentation,
    })
  }

  @catchError
  async updatePresentation(req: Request, res: Response) {
    const presentation = req.body as Presentation
    const presentationoriginal = await presentationRepository.findOne({
      where: {
        id: presentation.id,
      },
    })
    if (!presentationoriginal) throw notFound('No se encontro la presentación')

    if (presentationoriginal.presentation != presentation.presentation) {
      const items = await productItemRepository.find({
        where: {
          presentationId: presentation.id,
        },
      })
      const renamed = items.map((item) => {
        const originalname = item.itemName
        const splited = originalname.split('-')
        splited[3] = ' ' + presentation.presentation + ' '
        const newname = splited.join('-')

        return {
          ...item,
          itemName: newname,
        }
      })

      await AppDataSource.transaction(async (manager) => {
        await manager.update(Presentation, presentation.id, presentation)
        const promised = []
        for (const item of renamed) {
          promised.push(
            manager.update(Item, item.id, { itemName: item.itemName }),
          )
        }
        await Promise.all(promised)
      })
    } else {
      await presentationRepository.update(req.body.id, presentation)
    }

    res.json({
      brand: presentation,
    })
  }

  @catchError
  async deletePresentation(req: Request, res: Response) {
    const { id } = req.body
    try {
      await presentationRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await presentationRepository.update(id, {
          status: 0,
        })
        return res.json({
          message: 'Presentación deshabilitada',
        })
      } else {
        throw err
      }
    }
    res.json({
      message: 'Presentación eliminada',
    })
  }

  // unidad de medida
  @catchError
  async listMeasure(req: Request, res: Response) {
    const measures = await measureRepository.find({
      order: {
        id: 'DESC',
      },
    })
    res.json({
      data: measures,
    })
  }

  @catchError
  async createMeasure(req: Request, res: Response) {
    await measureRepository.insert(req.body)
    res.json({
      message: 'Unidad de medida creada',
    })
  }

  @catchError
  async updateMeasure(req: Request, res: Response) {
    await measureRepository.update(req.body.id, req.body)
    res.json({
      message: 'Unidad de medida actualizada',
    })
  }

  @catchError
  async deleteMeasure(req: Request, res: Response) {
    const { id } = req.body
    try {
      await measureRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await measureRepository.update(id, {
          status: 0,
        })
        return res.json({
          message: 'Unidad de medida deshabilitada',
        })
      } else {
        throw err
      }
    }
    res.json({
      message: 'Unidad de medida eliminada',
    })
  }

  @catchError
  async listEquivalences(req: Request, res: Response) {
    const equivalences = await equivalenceRepository.find({
      relations: {
        presentation: true,
        measure: true,
      },
      order: {
        id: 'DESC',
      },
    })

    res.json({
      data: equivalences,
    })
  }

  @catchError
  async createEquivalence(req: Request, res: Response) {
    await equivalenceRepository.insert(req.body)
    res.json({
      message: 'Equivalencia creada',
    })
  }

  @catchError
  async updateEquivalence(req: Request, res: Response) {
    await equivalenceRepository.update(req.body.id, req.body)
    res.json({
      message: 'Equivalencia actualizada',
    })
  }

  @catchError
  async deleteEquivalence(req: Request, res: Response) {
    const { id } = req.body
    try {
      await equivalenceRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await equivalenceRepository.update(id, {
          status: 0,
        })
        return res.json({
          message: 'Equivalencia deshabilitada',
        })
      } else {
        throw err
      }
    }
    res.json({
      message: 'Equivalencia eliminada',
    })
  }

  @catchError
  async listCategories(req: Request, res: Response) {
    const equivalences = await productCategoryRepository.find({
      order: {
        id: 'DESC',
      },
    })

    res.json({
      data: equivalences,
    })
  }

  @catchError
  async createCategory(req: Request, res: Response) {
    await productCategoryRepository.insert(req.body)
    res.json({
      message: 'Categoria creada',
    })
  }

  @catchError
  async updateCategory(req: Request, res: Response) {
    await productCategoryRepository.update(req.body.id, req.body)
    res.json({
      message: 'Categoria actualizada',
    })
  }

  @catchError
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.body
    try {
      await productCategoryRepository.delete(id)
    } catch (err: any) {
      const errorMessage: string = err?.sqlMessage ?? ''
      if (errorMessage.toLowerCase().includes('foreign key constraint fails')) {
        await productCategoryRepository.update(id, {
          status: 0,
        })
        return res.json({
          message: 'Categoria deshabilitada',
        })
      } else {
        throw err
      }
    }
    res.json({
      message: 'Categoria eliminada',
    })
  }

  @catchError
  async listTemplateBase(req: Request, res: Response) {
    const data = await AppDataSource.query(
      'select id,sucursal_type name,used_to type from inv_dispatchbase where status=1',
    )
    res.json({
      // data: data.map((el: any) => ({ ...el, type: getTypeTemplate(el.type) })),
      data,
    })
  }

  @catchError
  async listItemsTemplate(req: Request, res: Response) {
    const { id } = req.query as unknown as { id: number }
    const base = await invDispatchBase.findOne({ where: { id } })
    if (!base) throw badRequest('No se encontro la plantilla')

    const plantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: id,
      },
      relations: {
        itemMove: {
          product: {
            category: true,
            measure: true,
          },
          presentation: true,
        },
        itemStock: {
          product: {
            category: true,
            measure: true,
          },
          presentation: true,
        },
        measure: true,
      },
    })
    res.json({
      data: {
        id: base.id,
        name: base.sucursal_type,
        type: base.used_to,
        items: plantilla.map((el) => {
          return {
            id: el.id,
            measureId: el.measure_id,
            measureName: el.measure.measure,
            measureCode: el.measure.code,
            presentationId: el.presentation_id,
            presentationName: el.presentation_name,
            despacho: {
              id: el.itemMove.id,
              name: el.itemMove.itemName,
              categoryId: el.itemMove.product?.category?.id,
              categoryName: el.itemMove.product?.category?.category,
              measureId: el.itemMove.product?.measure?.id,
              measureName: el.itemMove.product?.measure?.measure,
              presentationId: el.itemMove.presentation?.id,
              presentationName: el.itemMove.presentation?.presentation,
            },
            inventario: {
              id: el.itemStock.id,
              name: el.itemStock.itemName,
              categoryId: el.itemStock.product?.category?.id,
              categoryName: el.itemStock.product?.category?.category,
              measureId: el.itemStock.product?.measure?.id,
              measureName: el.itemStock.product?.measure?.measure,
              presentationId: el.itemStock.presentation?.id,
              presentationName: el.itemStock.presentation?.presentation,
            },
          }
        }),
      },
    })
  }

  @catchError
  async updateItemTemplate(req: Request, res: Response) {
    const body = req.body as {
      id: number
      despachoId: number
      despachoName: string
      inventarioId: number
      inventarioName: string
      presentationId: number
      presentationName: string
      measureId: number
      measureName: string
    }
    const final: Partial<InvDispatchBaseItem> = {
      id: body.id,
      item_move_id: body.despachoId,
      item_move_name: body.despachoName,
      item_stock_id: body.inventarioId,
      presentation_id: body.presentationId,
      presentation_name: body.presentationName,
      measure_id: body.measureId,
      unitValue: 0,
      quantity: 0,
    }

    await invDispatchBaseItemRepository.update(body.id, final)

    res.json({
      message: 'Plantilla actualizada',
    })
  }

  @catchError
  async createItemTemplate(req: Request, res: Response) {
    const body = req.body as {
      baseId: number
      despachoId: number
      despachoName: string
      inventarioId: number
      inventarioName: string
      presentationId: number
      presentationName: string
      measureId: number
      measureName: string
    }
    const final: Partial<InvDispatchBaseItem> = {
      dispatch_id: body.baseId,
      item_move_id: body.despachoId,
      item_move_name: body.despachoName,
      item_stock_id: body.inventarioId,
      presentation_id: body.presentationId,
      presentation_name: body.presentationName,
      measure_id: body.measureId,
      unitValue: 0,
      quantity: 0,
    }

    await invDispatchBaseItemRepository.insert(final)

    res.json({
      message: 'Plantilla actualizada',
    })
  }

  @catchError
  async deleteItemTemplate(req: Request, res: Response) {
    const { id } = req.body as unknown as { id: number }
    await invDispatchBaseItemRepository.delete(id)
    res.json({
      message: 'Plantilla actualizada',
    })
  }

  @catchError
  async getListTemplateDispatch(req: Request, res: Response) {
    const itemsDispatch = await invDispatchBaseItemRepository.find({
      select: {
        id: true,
        itemMove: {
          id: true,
          productId: true,
          itemName: true,
          brandId: true,
          presentationId: true,
          unitPrice: true,
          brand: {
            brand: true,
          },
          presentation: {
            presentation: true,
          },
          product: {
            id: true,
            measure: {
              id: true,
              code: true,
            },
          },
        },
      },
      relations: {
        itemMove: {
          brand: true,
          presentation: true,
          product: {
            measure: true,
          },
        },
      },
      order: {
        itemMove: {
          itemName: 'ASC',
        },
      },
    })
    const items = itemsDispatch.map((el) => el.itemMove).filter((el) => el)
    const itemsUnique = items.reduce((acc, el) => {
      if (!acc.some((item) => item.id === el.id)) {
        acc.push(el)
      }
      return acc
    }, [] as Item[])

    res.json({
      message: 'Plantilla de despacho',
      data: itemsUnique,
    })
  }

  @catchError
  async getItemsInventario(req: Request, res: Response) {
    const idItemsStore = await invDispatchBase.findOne({
      where: {
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!idItemsStore)
      throw notFound('No se encontro la plantilla de despacho de tiendas')
    const itemsDispatch = await invDispatchBaseItemRepository.find({
      select: {
        id: true,
        itemStock: {
          id: true,
          productId: true,
          itemName: true,
          brandId: true,
          presentationId: true,
          unitPrice: true,
          brand: {
            brand: true,
          },
          presentation: {
            presentation: true,
          },
          product: {
            id: true,
            measure: {
              id: true,
              code: true,
            },
          },
        },
      },
      relations: {
        itemStock: {
          brand: true,
          presentation: true,
          product: {
            measure: true,
          },
        },
      },
      order: {
        itemStock: {
          itemName: 'ASC',
        },
      },
      where: {
        dispatch_id: idItemsStore.id,
      },
    })
    const items = itemsDispatch.map((el) => el.itemStock).filter((el) => el)
    const itemsUnique = items.reduce((acc, el) => {
      if (!acc.some((item) => item.id === el.id)) {
        acc.push(el)
      }
      return acc
    }, [] as Item[])

    res.json({
      message: 'Plantilla de inventario',
      data: itemsUnique,
    })
  }
}

export const getTypeTemplate = (type: string) => {
  switch (type) {
    case 'W':
      return 'Almacen'
    case 'D':
      return 'Despacho'
    case 'I':
      return 'Inventario de Tienda'
  }
}
