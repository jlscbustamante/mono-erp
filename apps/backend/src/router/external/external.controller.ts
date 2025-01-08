import { badRequest } from '@hapi/boom'
import { add, format, parseISO, sub } from 'date-fns'
import { Request, Response } from 'express'
import { In, IsNull, Not, Raw } from 'typeorm'

import jwt from 'jsonwebtoken'
import {
  DispatchType,
  InvDispatch,
  InvDispatchStatus,
  InvStock,
  Item,
  StockStatus,
} from 'pizzadb'
import config from '../../config/config'
import { AppDataSource } from '../../config/database'
import { DISPATCH_STATUS } from '../../core/inventory/entities/dispatch'
import { SucursalSale } from '../../entities/adm/SucursalSale'
import { DispatchUsedTo } from '../../entities/inventory/InvDispatchBase'
import { invDispatchRepository } from '../../repositories/inventory/dispatch.repository'
import {
  invDispatchBase,
  invDispatchBaseItemRepository,
} from '../../repositories/inventory/dispatchBaseLast.repository'
import { equivalenceRepository } from '../../repositories/inventory/equivalence.repository'
import { invStockRepository } from '../../repositories/inventory/invStock.repository'
import sucursalRepository from '../../repositories/sucursal.repository'
import { sucursaSaleRepository } from '../../repositories/sucursalSales.repository'
import { IToken } from '../../types'
import { catchError } from '../../utils/decorators'
import { ExternalService } from './external.service'

interface IStock {
  createdAt: string
  updatedAt: string
  id: number
  item_id: number
  item_name: string
  presentation_id: number
  presentation_name: string | number
  measure_id: number
  warehouse_id: string
  stock_at: string // YYYY-MM-DD HH:mm:ss
  stock_last: number
  quantity_in: number
  quantity_out: number
  stock_current: number
  stock_physical: number
  unit_value: number
  total_value: number
  created_by: string
  categoryId: number | undefined
  categoryName: string | undefined
  dispatched: number
}

interface ClientSipro {
  id: string
  tipo_documento_id: 2
  razon_social: string
  numero_documento: string
  telefono?: string
  correo?: string
  tipo_documento: {
    id: 2
    nombre: 'RUC'
  }
  locales: {
    id: string
    direccion?: string
    nombre_local: string
  }[]
}

interface DespachoSipro {
  id: number
  local_cliente_id?: string
  fecha_emision: string
  cliente_id: string
  modalidad_pago_id?: number
  detalles: {
    producto_id: number
    cantidad_solicitada: number
    cantidad_entregada: number
  }[]
  size?: number
}

const externalService = new ExternalService()
export class ExternalController {
  @catchError
  async getClientsSipro(req: Request, res: Response) {
    const bearer = req.headers.authorization
    if (!bearer) throw badRequest('No se envio el token')
    const token = bearer.split(' ')[1]
    if (!token) throw badRequest('No se envio el token')
    // verify toeken
    const isValid = jwt.verify(token, config.external.sipro.key)
    if (!isValid) throw badRequest('Token invalido')

    const clients = await sucursalRepository.find({
      where: {
        type_sede: 'T',
        sede_nro_ruc: Not(IsNull()),
      },
    })
    const clientes: ClientSipro[] = []
    for (const client of clients) {
      clientes.push({
        id: client.id,
        tipo_documento_id: 2,
        razon_social: client.legalperson_name,
        numero_documento: client.sede_nro_ruc,
        tipo_documento: {
          id: 2,
          nombre: 'RUC',
        },
        locales: [
          {
            id: client.id,
            nombre_local: client.title,
            direccion: client.ubi_address ?? undefined,
          },
        ],
      })
    }

    return res.json({
      data: clientes,
    })
  }

  @catchError
  async getDispatchSipro(req: Request, res: Response) {
    const bearer = req.headers.authorization
    if (!bearer) throw badRequest('No se envio el token')
    const token = bearer.split(' ')[1]
    if (!token) throw badRequest('No se envio el token')
    // verify toeken
    const isValid = jwt.verify(token, config.external.sipro.key)
    if (!isValid) throw badRequest('Token invalido')

    const { date } = req.query as { date: string }
    if (!date) throw badRequest('Fecha invalida (`date` en la url)')
    const despachos = await invDispatchRepository.find({
      where: {
        moveAt: Raw((el) => `Date(${el})=:date`, { date }),
        status: In([
          DISPATCH_STATUS.INVOICED,
          DISPATCH_STATUS.DISPATCHED,
          DISPATCH_STATUS.NEW,
        ]),
        moveType: DispatchType.WarehouseToStore,
      },
      relations: {
        items: true,
      },
    })

    const despachosSipro: DespachoSipro[] = []
    for (const despacho of despachos) {
      despachosSipro.push({
        id: despacho.id,
        fecha_emision: despacho.moveAt.split(' ')[0],
        cliente_id: despacho.wareToId,
        detalles:
          despacho.items?.map((el) => {
            return {
              producto_id: el.itemId,
              cantidad_solicitada: el.quantity,
              cantidad_entregada: el.quantity,
              presentacion_id: el.presentationId,
            }
          }) ?? [],
      })
    }

    return res.json({
      data: despachosSipro,
    })
  }

  @catchError
  async getOneDispatchSipro(req: Request, res: Response) {
    const bearer = req.headers.authorization
    if (!bearer) throw badRequest('No se envio el token')
    const token = bearer.split(' ')[1]
    if (!token) throw badRequest('No se envio el token')
    // verify toeken
    const isValid = jwt.verify(token, config.external.sipro.key)
    if (!isValid) throw badRequest('Token invalido')

    const { id } = req.params as { id: string }
    if (!id) throw badRequest('Id invalido (`id` en la url)')
    const despacho = await invDispatchRepository.findOne({
      where: {
        id: +id,
        status: In([
          DISPATCH_STATUS.INVOICED,
          DISPATCH_STATUS.DISPATCHED,
          DISPATCH_STATUS.NEW,
        ]),
        moveType: DispatchType.WarehouseToStore,
      },
      relations: {
        items: true,
      },
    })
    if (!despacho)
      return res.json({
        data: null,
      })

    const despachosSipro: DespachoSipro = {
      id: despacho.id,
      fecha_emision: despacho.moveAt.split(' ')[0],
      cliente_id: despacho.wareToId,
      detalles:
        despacho.items?.map((el) => {
          return {
            producto_id: el.itemId,
            cantidad_solicitada: el.quantity,
            cantidad_entregada: el.quantity,
          }
        }) ?? [],
    }

    return res.json({
      data: despachosSipro,
    })
  }

  @catchError
  async getItemsStockSipro(req: Request, res: Response) {
    const bearer = req.headers.authorization
    if (!bearer) throw badRequest('No se envio el token')
    const token = bearer.split(' ')[1]
    if (!token) throw badRequest('No se envio el token')
    // verify toeken
    const isValid = jwt.verify(token, config.external.sipro.key)
    if (!isValid) throw badRequest('Token invalido')

    const items = await externalService.getItemsSipro()
    return res.json({
      data: items,
    })
  }

  @catchError
  async createSucursalSale(req: Request, res: Response) {
    const data = req.body as Partial<SucursalSale>
    await sucursaSaleRepository.insert(data)
    return res.json({ message: 'ok', success: true })
  }

  @catchError
  async createStock(req: Request, res: Response) {
    const stock = req.body
    await externalService.createStock(stock)

    res.json({ message: 'stock creado correctamente' })
  }

  @catchError
  async updateStock(req: Request, res: Response) {
    const stock = req.body
    await externalService.upodateStock(stock)

    res.json({ message: 'stock actualizado correctamente' })
  }

  @catchError
  async deleteStock(req: Request, res: Response) {
    const { id } = req.body as { id: number }
    await externalService.deleteStock(id)

    res.json({ message: 'stock eliminado correctamente' })
  }

  @catchError
  async getStock(req: Request, res: Response) {
    const { id } = req.params as { id: string }
    const stock = await externalService.getStock(Number(id))

    res.json({ data: stock })
  }

  @catchError
  async getStockBySucursal(req: Request, res: Response) {
    const { code } = req.params as { code: string }
    const { stock_at, dispatch_at } = req.query as {
      stock_at?: string
      dispatch_at?: string
    }
    const stock = await externalService.getStocksBySucursal(
      // Number(id),
      code,
      stock_at,
      dispatch_at,
    )

    res.json({ data: stock })
  }

  @catchError
  async stockIsEmpty(req: Request, res: Response) {
    const { code } = req.query

    const hasStock = await externalService.hasStock(code as string)

    return res.json({ data: !hasStock })
  }

  @catchError
  async getReportInventory(req: Request, res: Response) {
    const { date, store_code } = req.query as {
      date: string
      store_code: string
    }

    const stock: IStock[] = await externalService.getStocksBySucursal(
      store_code,
      date,
      date,
    )

    let initialBalance = 0
    stock.forEach((el) => {
      initialBalance += Number(el.stock_last) * Number(el.unit_value)
    })

    let endingBalance = 0
    stock.forEach((el) => {
      endingBalance += Number(el.stock_physical) * Number(el.unit_value)
    })

    const warehouseDb = await sucursalRepository.find({
      where: {
        type_sede: 'W',
      },
      select: {
        id: true,
      },
    })
    const warehouseIds = warehouseDb.map((el) => el.id)

    const [dispatchFromWarehouse, dispatchFromStores, outStore] =
      await Promise.all([
        invDispatchRepository.find({
          where: {
            moveAt: Raw((alias) => `DATE(${alias}) = '${date}'`),
            wareToId: store_code,
            status: InvDispatchStatus.DISPATCHED,
            wareFromId: warehouseIds.length > 0 ? In(warehouseIds) : undefined,
          },
          relations: {
            items: true,
          },
        }),
        invDispatchRepository.find({
          where: {
            moveAt: Raw((alias) => `DATE(${alias}) = '${date}'`),
            wareToId: store_code,
            status: InvDispatchStatus.DISPATCHED,
            wareFromId:
              warehouseIds.length > 0 ? Not(In(warehouseIds)) : undefined,
          },
          relations: {
            items: true,
          },
        }),
        invDispatchRepository.find({
          where: {
            moveAt: Raw((alias) => `DATE(${alias}) = '${date}'`),
            wareFromId: store_code,
            status: InvDispatchStatus.DISPATCHED,
          },
          relations: {
            items: true,
          },
        }),
      ])

    const totalWarehouse = dispatchFromWarehouse.reduce((acc, el) => {
      return acc + el.totalValue
    }, 0)
    const totalStores = dispatchFromStores.reduce((acc, el) => {
      return acc + el.totalValue
    }, 0)
    const totalOutStore = outStore.reduce((acc, el) => {
      return acc + el.totalValue
    }, 0)

    return res.json({
      hasStock: stock.length > 0,
      saldoInicial: Number(initialBalance.toFixed(2)),
      saldoFinal: Number(endingBalance.toFixed(2)),
      totalAlmacen: Number(totalWarehouse.toFixed(2)),
      totalTiendaEntrada: Number(totalStores.toFixed(2)),
      totalDespachoSalida: Number(totalOutStore.toFixed(2)),
      // despachado: Number(valueDispatched.toFixed(2)),
    })
  }

  @catchError
  async getTemplateStock(req: Request, res: Response) {
    // const template = await getTemplate(DispatchBaseType.PIZZA_INV)
    const template = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA_INV,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!template) throw badRequest('No se encontro la plantilla')

    const items = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: template.id,
      },
    })

    return res.json({
      data: items,
    })
  }

  @catchError
  async getTemplateDispatch(req: Request, res: Response) {
    const { type } = req.query as { type: string }
    // const template = await getTemplate(DispatchBaseType.PIZZA_INV)
    const template = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA,
        sucursal_type: type,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!template) throw badRequest('No se encontro la plantilla')

    const items = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: template.id,
      },
      relations: {
        itemMove: {
          product: {
            measure: true,
            category: true,
          },
          presentation: true,
        },
      },
    })
    const mapped = items.map((el) => {
      return {
        id: el.itemMove.id,
        name: el.itemMove.itemName,
        measureCode: el.itemMove.product?.measure?.code,
        measureName: el.itemMove.product?.measure?.measure,
        unitPrice: el.itemMove.unitPrice,
        presentationId: el.itemMove.presentationId,
        presentation: el.itemMove.presentation.presentation,
        categoryName: el.itemMove.product?.category?.category ?? '',
      }
    })

    return res.json({
      data: mapped,
    })
  }

  @catchError
  async getTemplateNewStock(req: Request, res: Response) {
    const { date, sucursalCode, type } = req.query as {
      date: string
      sucursalCode: string
      type: string
    }

    // obtener plantilla de inventario
    const plantillaBase = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA_INV,
        sucursal_type: type,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!plantillaBase) {
      throw badRequest('No se encontro la plantilla para inventario')
    }
    const plantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: plantillaBase.id,
      },
      relations: {
        itemStock: {
          presentation: true,
          product: {
            category: true,
          },
        },
      },
    })

    // ultmo stock
    const lastStock = await invStockRepository.findOne({
      where: {
        warehouse_id: sucursalCode,
        status: StockStatus.CLOSED,
      },
      order: {
        stock_at: 'DESC',
      },
    })

    const stocks: InvStock[] = []
    if (!lastStock) {
      // regresa nuevo inventario basado en plantilla pero vacio
      for (const itemPlantilla of plantilla) {
        const stock = getDefaultStock(itemPlantilla.itemStock)
        stock.warehouse_id = sucursalCode
        stock.stock_at = date
        stock.quantity_in = 0
        stock.quantity_out = 0
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        stocks.push(stock)
      }
      return res.json({ base: stocks, isNew: true })
    }

    const datelastInventory = lastStock.stock_at.split(' ')[0]

    const lastIventory = await invStockRepository.find({
      where: {
        stock_at: Raw((alias) => `DATE(${alias})= :date `, {
          date: datelastInventory,
        }),
        status: StockStatus.CLOSED,
        warehouse_id: sucursalCode,
      },
    })
    const provitionalStock = await invStockRepository.find({
      where: {
        stock_at: Raw((alias) => `DATE(${alias})= :date `, {
          date: date,
        }),
        warehouse_id: sucursalCode,
      },
    })

    if (datelastInventory != date) {
      for (const itemPlantilla of plantilla) {
        const itemBefore = lastIventory.find(
          (el) => el.item_id == itemPlantilla.item_stock_id,
        )
        const itemProvitional = provitionalStock.find(
          (el) => el.item_id == itemPlantilla.item_stock_id,
        )
        const stock = getDefaultStock(itemPlantilla.itemStock)
        if (itemBefore) {
          stock.warehouse_id = sucursalCode
          stock.stock_at = date
          stock.stock_last = itemBefore.stock_physical
          stock.stock_current = stock.stock_last
        } else {
          stock.warehouse_id = sucursalCode
          stock.stock_at = date
        }
        if (itemProvitional) {
          stock.quantity_in = itemProvitional.quantity_in
          stock.quantity_out = itemProvitional.quantity_out
          stock.stock_current =
            stock.stock_last + stock.quantity_in - stock.quantity_out
        }
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        stocks.push(stock)
      }
    } else {
      throw badRequest(
        'No se puede generar un nuevo inventario para hoy, ya existe',
      )
    }

    return res.json({ base: stocks, isNew: !lastStock })
  }

  @catchError
  async getWarehouseLastStock(req: Request, res: Response) {
    const { sucursalCode } = req.query as { sucursalCode: string }
    const lastStock = await invStockRepository.findOne({
      select: {
        id: true,
        stock_at: true,
      },
      where: {
        warehouse_id: sucursalCode,
      },
      order: {
        stock_at: 'DESC',
      },
    })
    return res.json({
      data: lastStock?.stock_at ? lastStock.stock_at.split(' ')[0] : null,
    })
  }

  @catchError
  async getTemplateNewStockAlmacen(req: Request, res: Response) {
    const { date, sucursalCode } = req.query as {
      date: string
      sucursalCode: string
    }

    // obtener plantilla de inventario
    const plantillaBase = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA_INV,
        sucursal_type: 'PIZZA',
        used_to: DispatchUsedTo.Warehouse,
      },
    })
    if (!plantillaBase) {
      throw badRequest('No se encontro la plantilla para inventario')
    }
    const plantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: plantillaBase.id,
      },
      relations: {
        itemStock: {
          presentation: true,
          product: {
            category: true,
          },
        },
      },
    })

    // ultmo stock
    const lastStock = await invStockRepository.findOne({
      where: {
        warehouse_id: sucursalCode,
      },
      order: {
        stock_at: 'DESC',
      },
    })

    const stocks: InvStock[] = []
    if (!lastStock) {
      // regresa nuevo inventario basado en plantilla pero vacio
      for (const itemPlantilla of plantilla) {
        const stock = getDefaultStock(itemPlantilla.itemStock)
        stock.warehouse_id = sucursalCode
        stock.stock_at = date
        stock.quantity_in = 0
        stock.quantity_out = 0
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        stocks.push(stock)
      }
      return res.json({ base: stocks, isNew: true })
    }

    const datelastInventory = lastStock.stock_at.split(' ')[0]

    const lastIventory = await invStockRepository.find({
      where: {
        stock_at: Raw((alias) => `DATE(${alias})= :date `, {
          date: datelastInventory,
        }),
        warehouse_id: sucursalCode,
      },
    })

    if (datelastInventory != date) {
      for (const itemPlantilla of plantilla) {
        const itemBefore = lastIventory.find(
          (el) => el.item_id == itemPlantilla.item_stock_id,
        )
        const stock = getDefaultStock(itemPlantilla.itemStock)
        if (itemBefore) {
          stock.warehouse_id = sucursalCode
          stock.stock_at = date
          stock.stock_last = itemBefore.stock_physical
          stock.stock_current = stock.stock_last
        } else {
          stock.warehouse_id = sucursalCode
          stock.stock_at = date
        }
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        stocks.push(stock)
      }
    } else {
      throw badRequest(
        'No se puede generar un nuevo inventario para hoy, ya existe',
      )
    }

    return res.json({ base: stocks, isNew: !lastStock })
  }

  @catchError
  async saveNewStock(req: Request, res: Response) {
    const { inventario } = req.body as { inventario: InvStock[] }

    const warehouseId = inventario.find((el) => el.warehouse_id)?.warehouse_id
    const moveAt = inventario.find((el) => el.stock_at)?.stock_at

    if (!warehouseId)
      throw badRequest('No se encontraron los datos para actualizar')

    if (moveAt) {
      const date = moveAt.split(' ')[0]

      const hasDispatches = await storeHasDispatchBefore(warehouseId, date)
      if (hasDispatches)
        throw badRequest(
          'No se puede actualizar el stock, existen despachos pendientes',
        )
    }

    await AppDataSource.transaction(async (manager) => {
      const date = inventario.find((el) => el.stock_at)?.stock_at
      if (date) {
        await manager.delete(InvStock, {
          warehouse_id: warehouseId,
          stock_at: date,
        })
      }

      await manager.insert(
        InvStock,
        inventario.map((el) => ({
          ...el,
          status: StockStatus.CLOSED,
        })),
      )
    })

    return res.json({ message: 'Stock guardado correctamente' })
  }

  @catchError
  async getStockStore(req: Request, res: Response) {
    const { sucursalCode, date, type } = req.query as {
      sucursalCode: string
      date: string
      type: string
    }

    const surcursal = await sucursalRepository.findOne({
      where: {
        id: sucursalCode,
      },
    })

    const stock = await invStockRepository.find({
      where: {
        warehouse_id: sucursalCode,
        stock_at: Raw((alias) => `DATE(${alias})= :date `, { date }),
        status: StockStatus.CLOSED,
      },
    })

    const lastDateStock = await invStockRepository.findOne({
      where: {
        warehouse_id: sucursalCode,
        status: StockStatus.CLOSED,
      },
      order: {
        stock_at: 'DESC',
      },
    })
    if (stock.length == 0) {
      return res.json({
        lastStock: lastDateStock?.stock_at.split(' ')[0] ?? null,
        isEmpty: true,
        title: surcursal?.title ?? null,
        stock: [],
      })
    }

    const plantilla = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA_INV,
        sucursal_type: type,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!plantilla)
      throw badRequest('No se encontro la plantilla para inventario de tienda')
    const itemsPlantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: plantilla.id,
      },
      relations: {
        itemStock: {
          presentation: true,
          product: {
            category: true,
          },
        },
      },
    })

    const inventory: InvStock[] = []
    for (const itemPlantilla of itemsPlantilla) {
      const item = stock.find((el) => el.item_id == itemPlantilla.item_stock_id)
      if (item) {
        item.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(item)
      } else {
        const stock = getDefaultStock(itemPlantilla.itemStock)
        stock.warehouse_id = sucursalCode
        stock.stock_at = date
        stock.quantity_in = 0
        stock.quantity_out = 0
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(stock)
      }
    }

    return res.json({
      lastStock: lastDateStock?.stock_at.split(' ')[0] ?? null,
      isEmpty: false,
      title: surcursal?.title ?? null,
      stock: inventory,
    })
  }

  @catchError
  async getAnyStockStore(req: Request, res: Response) {
    const { sucursalCode, date, type } = req.query as {
      sucursalCode: string
      date: string
      type: string
    }

    const surcursal = await sucursalRepository.findOne({
      where: {
        id: sucursalCode,
      },
    })

    const stock = await invStockRepository.find({
      where: {
        warehouse_id: sucursalCode,
        stock_at: Raw((alias) => `DATE(${alias})= :date `, { date }),
      },
    })

    const lastDateStock = await invStockRepository.findOne({
      where: {
        warehouse_id: sucursalCode,
        status: StockStatus.CLOSED,
      },
      order: {
        stock_at: 'DESC',
      },
    })
    if (stock.length == 0) {
      return res.json({
        lastStock: lastDateStock?.stock_at.split(' ')[0] ?? null,
        isEmpty: true,
        title: surcursal?.title ?? null,
        stock: [],
      })
    }

    const plantilla = await invDispatchBase.findOne({
      where: {
        // sucursal_type: DispatchBaseType.PIZZA_INV,
        sucursal_type: type,
        used_to: DispatchUsedTo.Store,
      },
    })
    if (!plantilla)
      throw badRequest('No se encontro la plantilla para inventario de tienda')
    const itemsPlantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: plantilla.id,
      },
      relations: {
        itemStock: {
          presentation: true,
          product: {
            category: true,
          },
        },
      },
    })

    const inventory: InvStock[] = []
    for (const itemPlantilla of itemsPlantilla) {
      const item = stock.find((el) => el.item_id == itemPlantilla.item_stock_id)
      if (item) {
        item.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(item)
      } else {
        const stock = getDefaultStock(itemPlantilla.itemStock)
        stock.warehouse_id = sucursalCode
        stock.stock_at = date
        stock.quantity_in = 0
        stock.quantity_out = 0
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(stock)
      }
    }

    return res.json({
      isEmpty: false,
      lastStock: lastDateStock?.stock_at.split(' ')[0] ?? null,
      title: surcursal?.title ?? null,
      stock: inventory,
    })
  }

  @catchError
  async getStockWarehouse(req: Request, res: Response) {
    const { sucursalCode, date, type } = req.query as {
      sucursalCode: string
      date: string
      type: string
    }

    const stock = await invStockRepository.find({
      where: {
        warehouse_id: sucursalCode,
        stock_at: Raw((alias) => `DATE(${alias})= :date `, { date }),
      },
    })

    if (stock.length == 0) {
      const lastDateStock = await invStockRepository.findOne({
        where: {
          warehouse_id: sucursalCode,
        },
        order: {
          stock_at: 'DESC',
        },
      })
      return res.json({
        lastStock: lastDateStock?.stock_at.split(' ')[0] ?? null,
        isEmpty: true,
        stock: [],
      })
    }

    const plantilla = await invDispatchBase.findOne({
      where: {
        sucursal_type: type,
        used_to: DispatchUsedTo.Warehouse,
      },
    })
    if (!plantilla)
      throw badRequest('No se encontro la plantilla para inventario de tienda')
    const itemsPlantilla = await invDispatchBaseItemRepository.find({
      where: {
        dispatch_id: plantilla.id,
      },
      relations: {
        itemStock: {
          presentation: true,
          product: {
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

    const inventory: InvStock[] = []
    for (const itemPlantilla of itemsPlantilla) {
      const item = stock.find((el) => el.item_id == itemPlantilla.item_stock_id)
      if (item) {
        item.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(item)
      } else {
        const stock = getDefaultStock(itemPlantilla.itemStock)
        stock.warehouse_id = sucursalCode
        stock.stock_at = date
        stock.quantity_in = 0
        stock.quantity_out = 0
        stock.categoryName =
          itemPlantilla.itemStock.product?.category?.category ?? ''
        inventory.push(stock)
      }
    }

    return res.json({
      isEmpty: false,
      stock: inventory,
    })
  }

  @catchError
  async approveDispatch(req: Request, res: Response) {
    const { id } = req.body as { id: number; status: InvDispatchStatus }
    const token = req.headers.token as unknown as IToken

    const [almacenStock, tiendaStock] = await Promise.all([
      getStockAlmacen(id),
      getStockTienda(id),
    ])

    await AppDataSource.transaction(async (manger) => {
      const promises: any = []
      const allStock: InvStock[] = [...almacenStock, ...tiendaStock]
      allStock.forEach((el) => {
        promises.push(manger.save(InvStock, el))
      })
      await Promise.all(promises)

      manger.update(InvDispatch, id, {
        status: InvDispatchStatus.DISPATCHED,
        approvedBy: token.name,
      })
    })

    return res.json({
      message: 'Despachado correctamente',
    })
  }

  @catchError
  async approveDispatchBettwen(req: Request, res: Response) {
    const { id } = req.body as { id: number; status: InvDispatchStatus }
    const token = req.headers.token as unknown as IToken

    const [almacenStock, tiendaStock] = await Promise.all([
      getStockTiendaSalida(id),
      getStockTiendaEntrada(id),
    ])

    await AppDataSource.transaction(async (manger) => {
      const promises: any = []
      const allStock: InvStock[] = [...almacenStock, ...tiendaStock]
      allStock.forEach((el) => {
        promises.push(manger.save(InvStock, el))
      })
      await Promise.all(promises)

      manger.update(InvDispatch, id, {
        status: InvDispatchStatus.DISPATCHED,
        approvedBy: token.name,
      })
    })

    return res.json({
      message: 'Despachado correctamente',
    })
  }

  @catchError
  async updateStockStore(req: Request, res: Response) {
    const { update } = req.body as { update: Partial<InvStock>[] }
    if (!update.length)
      throw badRequest('No se encontraron datos para actualizar, lista vacia')

    const warehouseId = update.find((el) => el.warehouse_id)?.warehouse_id
    const stockAttt = update.find((el) => el.stock_at)?.stock_at

    if (!warehouseId || !stockAttt)
      throw badRequest('No se encontraron los datos para actualizar')
    // const itemData = update.find((el) => el.stock_at && el.warehouse_id)
    // if (!itemData) throw badRequest('No se encontraron inventario')
    const date = stockAttt.split(' ')[0]

    if (date) {
      const hasDispatches = await storeHasDispatchBefore(warehouseId, date)
      if (hasDispatches)
        throw badRequest(
          'No se puede actualizar el stock, existen despachos pendientes',
        )
    }

    const toUpdate = update.filter((el) => el.id)
    const toSave = update.filter((el) => !el.id)

    await AppDataSource.transaction(async (manager) => {
      const promises = []
      const promisesToSave = []
      for (const item of toUpdate) {
        promises.push(
          manager.update(InvStock, item.id, {
            stock_physical: item.stock_physical,
            total_value: item.total_value,
            status: StockStatus.CLOSED,
          }),
        )
      }
      for (const item of toSave) {
        promisesToSave.push(
          manager.insert(InvStock, {
            ...item,
            status: StockStatus.CLOSED,
          }),
        )
      }
      await Promise.all(promises)
      await Promise.all(promisesToSave)
      await manager.query(
        `UPDATE inv_stock SET status = ${StockStatus.CLOSED} WHERE warehouse_id='${warehouseId}' AND DATE(stock_at)='${date}'`,
      )
    })

    return res.json({ message: 'Stock actualizado correctamente' })
  }
}

export const getValidatedStockTiendaSalida = async (
  stocks: InvStock[],
  date: string,
  warehouseId: string,
): Promise<InvStock[]> => {
  // trar el ultimo stock
  const lastDateStock = await invStockRepository.findOne({
    where: {
      warehouse_id: warehouseId,
    },
    order: {
      stock_at: 'DESC',
    },
  })
  if (!lastDateStock) return stocks.filter((el) => el.quantity_out != 0)

  const finalStocks: InvStock[] = []

  const stocksBefore = await invStockRepository.find({
    where: {
      stock_at: Raw((alias) => `DATE(${alias})= :date `, {
        date: lastDateStock.stock_at.split(' ')[0],
      }),
      warehouse_id: warehouseId,
    },
  })

  if (lastDateStock.stock_at.split(' ')[0] != date) {
    // crear basandonos en el anterior
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )
      if (!itemBefore) {
        if (itemStock.quantity_out == 0) continue
        finalStocks.push(itemStock)
        continue
      } else {
        itemStock.stock_last = itemBefore.stock_physical
        itemStock.stock_current =
          itemStock.stock_last + itemStock.quantity_out * -1
        // itemStock.stock_physical = itemStock.stock_last + itemStock.quantity_out
        itemStock.stock_physical = 0
        itemStock.total_value = 0

        finalStocks.push(itemStock)
      }
    }
  } else {
    // actualizar solo los items diferentes
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )
      if (!itemBefore) {
        if (itemStock.quantity_out == 0) continue
        finalStocks.push(itemStock)
        continue
      } else {
        itemStock.id = itemBefore.id
        itemStock.stock_last = itemBefore.stock_last
        itemStock.quantity_in = itemBefore.quantity_in
        itemStock.quantity_out =
          itemBefore.quantity_out + itemStock.quantity_out
        itemStock.stock_current =
          itemStock.stock_last +
          itemStock.quantity_in +
          itemStock.quantity_out * -1
        itemStock.stock_physical = itemBefore.stock_physical
        itemStock.total_value = itemBefore.unit_value * itemStock.stock_physical

        finalStocks.push(itemStock)
      }
    }
  }

  return finalStocks
}

export const getValidatedStockAlmacen = async (
  stocks: InvStock[],
  date: string,
  warehouseId: string,
): Promise<InvStock[]> => {
  // trar el ultimo stock
  const lastDateStock = await invStockRepository.findOne({
    where: {
      warehouse_id: warehouseId,
    },
    order: {
      stock_at: 'DESC',
    },
  })
  if (!lastDateStock) return stocks.filter((el) => el.quantity_out != 0)

  const finalStocks: InvStock[] = []

  const stocksBefore = await invStockRepository.find({
    where: {
      stock_at: Raw((alias) => `DATE(${alias})= :date `, {
        date: lastDateStock.stock_at.split(' ')[0],
      }),
      warehouse_id: warehouseId,
    },
  })

  if (lastDateStock.stock_at.split(' ')[0] != date) {
    // crear basandonos en el anterior
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )
      if (!itemBefore) {
        if (itemStock.quantity_out == 0) continue
        finalStocks.push(itemStock)
        continue
      } else {
        itemStock.stock_last = itemBefore.stock_physical
        itemStock.stock_current = itemStock.stock_last + itemStock.quantity_out
        itemStock.stock_physical = 0
        itemStock.total_value = 0

        finalStocks.push(itemStock)
      }
    }
  } else {
    // actualizar solo los items diferentes
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )
      if (!itemBefore) {
        if (itemStock.quantity_out == 0) continue
        finalStocks.push(itemStock)
        continue
      } else {
        itemStock.id = itemBefore.id
        itemStock.stock_last = itemBefore.stock_last
        itemStock.quantity_out =
          itemBefore.quantity_out + itemStock.quantity_out
        itemStock.stock_current = itemStock.stock_last + itemStock.quantity_out
        itemStock.stock_physical = 0
        itemStock.total_value = 0

        finalStocks.push(itemStock)
      }
    }
  }

  return finalStocks
}

export const getValidatedStockTienda = async (
  stocks: InvStock[],
  date: string,
  warehouseId: string,
): Promise<InvStock[]> => {
  // trar el ultimo stock
  const lastDateStock = await invStockRepository.findOne({
    where: {
      warehouse_id: warehouseId,
    },
    order: {
      stock_at: 'DESC',
    },
  })

  if (!lastDateStock) return stocks.filter((el) => el.quantity_in != 0)
  const finalStocks: InvStock[] = []

  const stocksBefore = await invStockRepository.find({
    where: {
      stock_at: Raw((alias) => `DATE(${alias})= :date `, {
        date: lastDateStock.stock_at.split(' ')[0],
      }),
      warehouse_id: warehouseId,
    },
  })

  if (lastDateStock.stock_at.split(' ')[0] != date) {
    // crear basandonos en el anterior
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )
      if (!itemBefore) {
        if (itemStock.quantity_in == 0) continue
        finalStocks.push(itemStock)
        continue
      } else if (
        itemBefore &&
        itemBefore.stock_physical == 0 &&
        itemStock.quantity_in == 0
      )
        continue
      else {
        itemStock.stock_last = itemBefore.stock_physical
        itemStock.stock_current = itemStock.stock_last + itemStock.quantity_in
        // itemStock.stock_physical = itemStock.stock_last + itemStock.quantity_in
        itemStock.stock_physical = 0
        itemStock.total_value = itemStock.unit_value * itemStock.stock_physical

        finalStocks.push(itemStock)
      }
    }
  } else {
    // actualizar solo los items diferentes
    for (const itemStock of stocks) {
      const itemBefore = stocksBefore.find(
        (el) => el.item_id == itemStock.item_id,
      )

      if (!itemBefore) {
        if (itemStock.quantity_in == 0) continue
        finalStocks.push(itemStock)
        continue
      } else {
        itemStock.id = itemBefore.id
        itemStock.stock_last = itemBefore.stock_last
        itemStock.quantity_out = itemBefore.quantity_out
        itemStock.stock_current =
          itemBefore.stock_last +
          itemBefore.quantity_in +
          itemStock.quantity_in -
          itemStock.quantity_out
        itemStock.quantity_in = itemBefore.quantity_in + itemStock.quantity_in
        // itemStock.stock_current = itemStock.stock_last + itemStock.quantity_in
        // itemStock.stock_current =
        // itemBefore.stock_current + itemStock.quantity_in
        // itemStock.stock_physical = itemStock.stock_current
        itemStock.stock_physical = itemBefore.stock_physical
        itemStock.total_value = itemStock.unit_value * itemStock.stock_physical
        finalStocks.push(itemStock)
      }
    }
  }
  return finalStocks
}

export const getDefaultStock = (item: Item): InvStock => {
  const newStock = new InvStock()
  newStock.item_id = item.id
  newStock.item_name = item.itemName
  newStock.presentation_id = item.presentationId
  newStock.presentation_name = item.presentation.presentation
  newStock.measure_id = item.measureId
  newStock.stock_last = 0
  newStock.stock_current = 0
  newStock.stock_physical = 0
  newStock.quantity_in = 0
  newStock.quantity_out = 0
  newStock.unit_value = item.unitPrice
  newStock.total_value = 0

  return newStock
}

export const getStockTienda = async (
  dispatchId: number,
): Promise<InvStock[]> => {
  const plantillaBase = await invDispatchBase.findOne({
    where: {
      // sucursal_type: DispatchBaseType.PIZZA,
      sucursal_type: 'PIZZA',
      used_to: DispatchUsedTo.Store,
    },
  })
  if (!plantillaBase) throw badRequest('No se encontro la plantilla')
  const plantilla = await invDispatchBaseItemRepository.find({
    where: {
      dispatch_id: plantillaBase.id,
    },
    relations: {
      itemStock: {
        presentation: true,
      },
      itemMove: true,
    },
  })

  // traemos el depsacho
  const dispatch = await invDispatchRepository.findOne({
    where: {
      id: dispatchId,
    },
    relations: {
      items: true,
    },
  })
  if (!dispatch) throw badRequest('Despacho no encontrado')

  const dispatchAt = dispatch.moveAt.split(' ')[0]
  const nextDate = format(add(parseISO(dispatchAt), { days: 1 }), 'yyyy-MM-dd')

  const statusNext = await getStatusStock(dispatch.wareToId, nextDate)
  if (statusNext == StockStatus.CLOSED)
    throw badRequest('Inventario cerrado, no se puede despachar')
  const lastStock = await getLastClosedStock(dispatch.wareToId)
  if (lastStock) {
    const nxData = format(
      add(parseISO(lastStock.stock_at), { days: 1 }),
      'yyyy-MM-dd',
    )
    if (nxData != dispatchAt && lastStock.stock_at != dispatchAt) {
      throw badRequest(
        'TIENDA: No se puede despachar, hay inventarios pendientes por cerrar',
      )
    }
  }

  const stocks: InvStock[] = []

  // traer las equivalencias
  const needPresentationsId = plantilla.map((el) => Number(el.presentation_id))
  const needMeasuresId = plantilla.map((el) => Number(el.measure_id))

  const equivalencias = await equivalenceRepository.find({
    where: {
      presentation_from: In(needPresentationsId),
      measure_to: In(needMeasuresId),
    },
  })

  for (const itemPlantilla of plantilla) {
    const itemDispached = dispatch.items?.find(
      (el) => el.itemId === itemPlantilla.item_move_id,
    )
    const stock: InvStock = getDefaultStock(itemPlantilla.itemStock)
    const isSameInStock =
      itemPlantilla.item_move_id == itemPlantilla.item_stock_id

    const myEquivalence = equivalencias.find(
      (el) =>
        el.presentation_from == itemPlantilla.presentation_id &&
        el.measure_to == itemPlantilla.measure_id,
    )

    if (!itemDispached) {
      stock.warehouse_id = dispatch.wareToId
      stock.stock_at = dispatchAt
      stock.quantity_in = 0
    } else {
      let realQuantity = itemDispached.quantity
      if (!isSameInStock) {
        if (!myEquivalence) {
          throw badRequest(
            'No se encontro la equivalencia para el item ' +
              itemPlantilla.item_move_name +
              '. No se puede generar el stock para la tienda',
          )
        }
        realQuantity = itemDispached.quantity * myEquivalence.value_factor
      }
      stock.warehouse_id = dispatch.wareToId
      stock.stock_at = dispatchAt
      stock.stock_current = realQuantity
      stock.unit_value = itemPlantilla.itemStock.unitPrice
      // stock.stock_physical = stock.stock_current
      stock.stock_physical = 0
      stock.total_value =
        itemPlantilla.itemStock.unitPrice * stock.stock_physical
      stock.quantity_in = realQuantity
    }
    stocks.push(stock)
  }

  return await getValidatedStockTienda(stocks, dispatchAt, dispatch.wareToId)
}

export const getStockAlmacen = async (
  dispatchId: number,
): Promise<InvStock[]> => {
  const plantillaBase = await invDispatchBase.findOne({
    where: {
      // sucursal_type: DispatchBaseType.ALMACEN,
      sucursal_type: 'PIZZA',
      used_to: DispatchUsedTo.Warehouse,
    },
  })
  if (!plantillaBase) throw badRequest('No se encontro la plantilla')
  const plantilla = await invDispatchBaseItemRepository.find({
    where: {
      dispatch_id: plantillaBase.id,
    },
    relations: {
      itemStock: {
        presentation: true,
      },
      itemMove: true,
    },
  })

  // traemos el depsacho
  const dispatch = await invDispatchRepository.findOne({
    where: {
      id: dispatchId,
    },
    relations: {
      items: true,
    },
  })
  if (!dispatch) throw badRequest('Despacho no encontrado')

  const dispatchAt = dispatch.moveAt.split(' ')[0]
  const beforeDispatchAt = format(
    sub(parseISO(dispatchAt), { days: 1 }),
    'yyyy-MM-dd',
  )
  // eslint-disable-next-line unused-imports/no-unused-vars
  const statusDispatch = await getStatusStock(
    dispatch.wareFromId,
    beforeDispatchAt,
  )
  // NOTE: ARREGLAR ESTO
  // if (statusDispatch && statusDispatch != StockStatus.CLOSED) {
  //   throw badRequest(
  //     'Necesita cerrar el inventario de almacen del dia anterior',
  //   )
  // }

  const stocks: InvStock[] = []

  const needPresentationsId = plantilla.map((el) => Number(el.presentation_id))
  const needMeasuresId = plantilla.map((el) => Number(el.measure_id))

  const equivalencias = await equivalenceRepository.find({
    where: {
      presentation_from: In(needPresentationsId),
      measure_to: In(needMeasuresId),
    },
  })

  for (const itemPlantilla of plantilla) {
    const itemDispached = dispatch.items?.find(
      (el) => el.itemId === itemPlantilla.item_move_id,
    )
    const stock: InvStock = getDefaultStock(itemPlantilla.itemStock)
    const isSameInStock =
      itemPlantilla.item_move_id == itemPlantilla.item_stock_id
    const myEquivalence = equivalencias.find(
      (el) =>
        el.presentation_from == itemPlantilla.presentation_id &&
        el.measure_to == itemPlantilla.measure_id,
    )

    if (!itemDispached) {
      stock.warehouse_id = dispatch.wareFromId
      stock.stock_at = dispatchAt
      stock.quantity_out = 0
    } else {
      let realQuantity = itemDispached.quantity
      if (!isSameInStock) {
        if (!myEquivalence) {
          throw badRequest(
            'No se encontro la equivalencia para el item ' +
              itemPlantilla.item_move_name +
              '. No se puede generar el stock para la tienda',
          )
        }
        realQuantity = itemDispached.quantity * myEquivalence.value_factor
      }
      stock.warehouse_id = dispatch.wareFromId
      stock.stock_at = dispatchAt
      stock.unit_value = itemPlantilla.itemStock.unitCost
      stock.quantity_out = realQuantity * -1
      stock.stock_current = stock.quantity_out
      stock.stock_physical = 0
      stock.total_value = 0
    }
    stocks.push(stock)
  }

  return await getValidatedStockAlmacen(stocks, dispatchAt, dispatch.wareFromId)
}

export const getStockTiendaEntrada = async (
  dispatchId: number,
): Promise<InvStock[]> => {
  const plantillaBase = await invDispatchBase.findOne({
    where: {
      // sucursal_type: DispatchBaseType.PIZZA,
      sucursal_type: 'PIZZA',
      used_to: DispatchUsedTo.Store,
    },
  })
  if (!plantillaBase) throw badRequest('No se encontro la plantilla')
  const plantilla = await invDispatchBaseItemRepository.find({
    where: {
      dispatch_id: plantillaBase.id,
    },
    relations: {
      itemStock: {
        presentation: true,
      },
      itemMove: true,
    },
  })

  // traemos el depsacho
  const dispatch = await invDispatchRepository.findOne({
    where: {
      id: dispatchId,
    },
    relations: {
      items: true,
    },
  })
  if (!dispatch) throw badRequest('Despacho no encontrado')

  const dispatchAt = dispatch.moveAt.split(' ')[0]

  const afterDate = format(add(parseISO(dispatchAt), { days: 1 }), 'yyyy-MM-dd')
  const statusDate = await getStatusStock(dispatch.wareToId, afterDate)
  if (statusDate == StockStatus.CLOSED)
    throw badRequest('Inventario cerrado, no se puede despachar')

  const lastStock = await getLastClosedStock(dispatch.wareToId)
  if (lastStock) {
    const nextDate = format(
      add(parseISO(lastStock.stock_at), { days: 1 }),
      'yyyy-MM-dd',
    )
    if (lastStock.stock_at != dispatchAt && nextDate != dispatchAt) {
      throw badRequest(
        'TIENDA ENTRADA: No se puede despachar, hay inventarios pendientes por cerrar',
      )
    }
  }

  const stocks: InvStock[] = []

  // traer las equivalencias
  const needPresentationsId = plantilla.map((el) => Number(el.presentation_id))
  const needMeasuresId = plantilla.map((el) => Number(el.measure_id))

  const equivalencias = await equivalenceRepository.find({
    where: {
      presentation_from: In(needPresentationsId),
      measure_to: In(needMeasuresId),
    },
  })

  for (const itemPlantilla of plantilla) {
    const itemDispached = dispatch.items?.find(
      (el) => el.itemId === itemPlantilla.item_stock_id,
    )
    const stock: InvStock = getDefaultStock(itemPlantilla.itemStock)
    const isSameInStock = true

    const myEquivalence = equivalencias.find(
      (el) =>
        el.presentation_from == itemPlantilla.presentation_id &&
        el.measure_to == itemPlantilla.measure_id,
    )

    if (!itemDispached) {
      stock.warehouse_id = dispatch.wareToId
      stock.stock_at = dispatchAt
      stock.quantity_in = 0
    } else {
      let realQuantity = itemDispached.quantity
      if (!isSameInStock) {
        if (!myEquivalence) {
          throw badRequest(
            'No se encontro la equivalencia para el item ' +
              itemPlantilla.item_move_name +
              '. No se puede generar el stock para la tienda',
          )
        }
        realQuantity = itemDispached.quantity * myEquivalence.value_factor
      }
      stock.warehouse_id = dispatch.wareToId
      stock.stock_at = dispatchAt
      stock.stock_current = realQuantity
      stock.unit_value = itemPlantilla.itemStock.unitPrice
      // stock.stock_physical = stock.stock_current
      stock.stock_physical = 0
      stock.total_value =
        itemPlantilla.itemStock.unitPrice * stock.stock_physical
      stock.quantity_in = realQuantity
    }
    stocks.push(stock)
  }

  return await getValidatedStockTienda(stocks, dispatchAt, dispatch.wareToId)
}

export const getStockTiendaSalida = async (
  dispatchId: number,
): Promise<InvStock[]> => {
  const plantillaBase = await invDispatchBase.findOne({
    where: {
      sucursal_type: 'PIZZA',
      used_to: DispatchUsedTo.Store,
    },
  })
  if (!plantillaBase) throw badRequest('No se encontro la plantilla')
  const plantilla = await invDispatchBaseItemRepository.find({
    where: {
      dispatch_id: plantillaBase.id,
    },
    relations: {
      itemStock: {
        presentation: true,
      },
      itemMove: true,
    },
  })

  // traemos el depsacho
  const dispatch = await invDispatchRepository.findOne({
    where: {
      id: dispatchId,
    },
    relations: {
      items: true,
    },
  })
  if (!dispatch) throw badRequest('Despacho no encontrado')

  const dispatchAt = dispatch.moveAt.split(' ')[0]

  const afterDate = format(add(parseISO(dispatchAt), { days: 1 }), 'yyyy-MM-dd')
  const statusDate = await getStatusStock(dispatch.wareFromId, afterDate)
  if (statusDate == StockStatus.CLOSED)
    throw badRequest('Inventario cerrado, no se puede despachar')

  const lastStock = await getLastClosedStock(dispatch.wareToId)
  if (lastStock) {
    const nextDate = format(
      add(parseISO(lastStock.stock_at), { days: 1 }),
      'yyyy-MM-dd',
    )
    if (lastStock.stock_at != dispatchAt && nextDate != dispatchAt) {
      throw badRequest(
        'TIENDA SALIDA: No se puede despachar, hay inventarios pendientes por cerrar',
      )
    }
  }

  const stocks: InvStock[] = []

  const needPresentationsId = plantilla.map((el) => Number(el.presentation_id))
  const needMeasuresId = plantilla.map((el) => Number(el.measure_id))

  const equivalencias = await equivalenceRepository.find({
    where: {
      presentation_from: In(needPresentationsId),
      measure_to: In(needMeasuresId),
    },
  })

  for (const itemPlantilla of plantilla) {
    const itemDispached = dispatch.items?.find(
      (el) => el.itemId === itemPlantilla.item_stock_id,
    )
    const stock: InvStock = getDefaultStock(itemPlantilla.itemStock)
    const isSameInStock = true
    const myEquivalence = equivalencias.find(
      (el) =>
        el.presentation_from == itemPlantilla.presentation_id &&
        el.measure_to == itemPlantilla.measure_id,
    )

    if (!itemDispached) {
      stock.warehouse_id = dispatch.wareFromId
      stock.stock_at = dispatchAt
      stock.quantity_out = 0
    } else {
      let realQuantity = itemDispached.quantity
      if (!isSameInStock) {
        if (!myEquivalence) {
          throw badRequest(
            'No se encontro la equivalencia para el item ' +
              itemPlantilla.item_move_name +
              '. No se puede generar el stock para la tienda',
          )
        }
        realQuantity = itemDispached.quantity * myEquivalence.value_factor
      }
      stock.warehouse_id = dispatch.wareFromId
      stock.stock_at = dispatchAt
      stock.unit_value = itemPlantilla.itemStock.unitCost
      stock.quantity_out = realQuantity
      stock.stock_current = stock.quantity_out * -1
      // stock.stock_physical = stock.stock_current
      stock.stock_physical = 0
      stock.total_value = 0
    }
    stocks.push(stock)
  }

  return await getValidatedStockTiendaSalida(
    stocks,
    dispatchAt,
    dispatch.wareFromId,
  )
}

export const getStatusStock = async (
  sucursalCode: string,
  date: string,
): Promise<StockStatus | null> => {
  const lastStock = await invStockRepository.findOne({
    where: {
      warehouse_id: sucursalCode,
      stock_at: Raw((alias) => `DATE(${alias}) = '${date}'`),
      status: StockStatus.CLOSED,
    },
    order: {
      id: 'DESC',
    },
  })

  if (!lastStock) return null

  return lastStock.status as StockStatus
}

export const getLastClosedStock = async (
  sucursalCode: string,
): Promise<InvStock | null> => {
  const lastStock = await invStockRepository.findOne({
    where: {
      warehouse_id: sucursalCode,
      status: StockStatus.CLOSED,
    },
    order: {
      id: 'DESC',
    },
  })

  if (!lastStock) return null
  return {
    ...lastStock,
    stock_at: lastStock.stock_at.split(' ')[0] as string,
  } as InvStock
}

export const storeHasDispatches = async (sucursalCode: string) => {
  const dispatches = await invDispatchRepository.find({
    where: {
      wareToId: sucursalCode,
      status: In([InvDispatchStatus.APPROVED, InvDispatchStatus.NEW]),
    },
  })
  return dispatches.length > 0
}

export const storeHasDispatchBefore = async (
  sucursalCode: string,
  date: string,
) => {
  const dispatches = await invDispatchRepository.find({
    where: {
      wareToId: sucursalCode,
      status: In([InvDispatchStatus.APPROVED, InvDispatchStatus.NEW]),
      moveAt: Raw((alias) => `DATE(${alias}) <= '${date}'`),
    },
  })
  return dispatches.length > 0
}
