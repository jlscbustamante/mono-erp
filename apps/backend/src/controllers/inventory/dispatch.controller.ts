import { badRequest } from '@hapi/boom'
import axios from 'axios'
import { add, format, parseISO, sub } from 'date-fns'
import { Request, Response } from 'express'
import { In, Raw } from 'typeorm'

import {
  DispatchType,
  InvDispatch,
  InvDispatchItem,
  InvDispatchStatus,
  InvStock,
  StockStatus,
  SucursalAsWarehouse,
} from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { DispatchRepository } from '../../repositories/dispatchRepository'
import { invDispatchRepository } from '../../repositories/inventory/dispatch.repository'
import { dispatchBaseRepository } from '../../repositories/inventory/dispatchBase.repository'
import { invDispatchItemRepository } from '../../repositories/inventory/dispatchItem.repository'
import { invStockRepository } from '../../repositories/inventory/invStock.repository'
import { invWarehouseRepository } from '../../repositories/inventory/invWarehouse.repository'
import { productItemRepository } from '../../repositories/inventory/item.repository'
import sucursalRepository from '../../repositories/sucursal.repository'
import {
  getStatusStock,
  getStockAlmacen,
  getStockTienda,
} from '../../router/external/external.controller'
import { createDispatchFN } from '../../services/inventory/createDispatch'
import { PosService } from '../../services/Pos.service'
import { IToken, ITransportista } from '../../types'
import { catchError } from '../../utils/decorators'

const dispatchRepository = new DispatchRepository()

export class DispatchController {
  @catchError
  async createWarehouse(req: Request, res: Response) {
    const warehouse = req.body
    await invWarehouseRepository.insert(warehouse)
    res.json({
      message: 'Creado correctamente',
    })
  }

  @catchError
  async getSucursalList(req: Request, res: Response) {
    const sucursales = await sucursalRepository.find()
    res.json({
      data: sucursales,
    })
  }

  @catchError
  async filterWarehouses(req: Request, res: Response) {
    // const filters = req.body

    // const {
    //   data: warehouses,
    //   count,
    //   totalPages: totalPage,
    // } = await invWarehouseRepository.filter3(filters)
    // res.json({
    //   data: {
    //     warehouses,
    //     count,
    //     totalPage,
    //   },
    // })

    const warehouses = await AppDataSource.getRepository(
      SucursalAsWarehouse,
    ).find({})

    res.json({
      data: {
        warehouses,
        count: 1,
        totalPage: 1,
      },
    })
  }

  @catchError
  async createDispatch(req: Request, res: Response) {
    const dispatchBody: InvDispatch & { storeId: string } = req.body
    // res.json({ message: req.body })
    const dispatch = await createDispatchFN(dispatchBody)

    const items = dispatch.items as InvDispatchItem[]
    const notduplicateitems = items.reduce((acc, item) => {
      const index = acc.findIndex((el) => el.itemId === item.itemId)
      if (index === -1) {
        acc.push(item)
      }
      return acc
    }, [] as InvDispatchItem[])
    if (notduplicateitems.length == 0)
      throw badRequest('No se puede crear un despacho sin items')

    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, {
        ...dispatch,
        moveType: DispatchType.WarehouseToStore,
      })
      const items = dispatch.items as InvDispatchItem[]

      for (const item of items) {
        item.dispatchId = result.raw.insertId
      }
      await manager.insert(InvDispatchItem, items)
    })

    res.json({ message: 'Creado correctamente' })
  }

  @catchError
  async createDispatchBetween(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const dispatchBody: InvDispatch & { storeId: string; storeFromId: string } =
      req.body
    const dispatch = await createDispatchFN(dispatchBody)
    let idInserted: number | undefined = undefined
    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, {
        ...dispatch,
        wareFromId: dispatchBody.storeFromId,
        moveType: DispatchType.BetweenStores,
        createdBy: token.name,
        status: InvDispatchStatus.APPROVED,
      })
      idInserted = result.raw.insertId
      const items = dispatch.items as InvDispatchItem[]
      for (const item of items) {
        item.dispatchId = result.raw.insertId
      }
      await manager.insert(InvDispatchItem, items)
    })

    res.json({ message: 'Creado correctamente', data: idInserted })
  }

  @catchError
  async updateDispatch(req: Request, res: Response) {
    const dispatch: Partial<InvDispatch> = req.body
    const dispatchId = dispatch.id
    const items = dispatch.items as Partial<InvDispatchItem>[] | undefined
    delete dispatch.items
    const dispathBD = await invDispatchRepository.findOne({
      where: { id: dispatchId },
    })
    if (!dispathBD) throw badRequest('Despacho no encontrado')
    if (dispathBD.status == InvDispatchStatus.DISPATCHED)
      throw badRequest('El despacho ya fue aprobado')
    // else if (dispathBD.status == InvDispatchStatus.NEW) {
    //   dispatch.status = InvDispatchStatus.APPROVED
    // }

    const newItems = items?.filter((el) => el.id == -1 || !el.id) ?? []
    const updateItems = items?.filter((el) => el.id != -1 && el.id) ?? undefined
    const itemsDB = await productItemRepository.find({
      where: {
        id: In(newItems.map((el) => el.itemId)),
      },
      relations: {
        presentation: true,
      },
    })
    const mapedNewItems: Partial<InvDispatchItem>[] = itemsDB
      .map((el) => {
        const item = newItems.find((item) => item.itemId == el.id)
        return {
          itemId: el.id,
          itemName: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentation?.presentation ?? '',
          measureId: el.measureId,
          weight: 0,
          unitValue: el.unitPrice,
          quantity: item?.quantity ?? 0,
          totalValue: Number((el.unitPrice * (item?.quantity ?? 0)).toFixed(2)),
        }
      })
      .filter((el) => el.quantity > 0)

    await AppDataSource.transaction(async (manager) => {
      await invDispatchRepository.update(dispatch.id!, dispatch)

      if (updateItems) {
        if (updateItems.length == 0)
          await invDispatchItemRepository.delete({ dispatchId: dispatch.id })
        else {
          const promises: any[] = []
          for (const item of updateItems) {
            // promises.push(invDispatchItemRepository.delete({ dispatchId: dispatch.id, itemId: item.itemId }))
            if (item.id) {
              if (item.quantity == 0) {
                promises.push(manager.delete(InvDispatchItem, { id: item.id }))
              } else {
                promises.push(
                  manager.update(
                    InvDispatchItem,
                    { id: item.id, dispatchId: dispatch.id },
                    item,
                  ),
                )
              }
            }
          }
          if (mapedNewItems.length > 0) {
            promises.push(
              manager.insert(
                InvDispatchItem,
                mapedNewItems.map((el) => ({ ...el, dispatchId: dispatch.id })),
              ),
            )
          }
          await Promise.all(promises)
        }
      }
    })

    res.json({ message: 'Actualizado correctamente' })
  }

  @catchError
  async updateDispatchAndApprove(req: Request, res: Response) {
    const dispatch: Partial<InvDispatch> = req.body
    const token = req.headers.token as unknown as IToken
    const dispatchId = dispatch.id
    const items = dispatch.items as Partial<InvDispatchItem>[] | undefined
    delete dispatch.items
    const dispathBD = await invDispatchRepository.findOne({
      where: { id: dispatchId },
      relations: {
        wareFrom: true,
        wareTo: true,
      },
    })

    if (!dispathBD) throw badRequest('Despacho no encontrado')
    if (dispathBD.status == InvDispatchStatus.DISPATCHED)
      throw badRequest('El despacho ya fue aprobado')
    // else if (dispathBD.status == InvDispatchStatus.NEW) {
    //   dispatch.status = InvDispatchStatus.APPROVED
    // }

    if (!dispatch.wareFromId || !dispatch.wareToId)
      throw badRequest('Complete los campos de origen y destino')

    const dispatchAt = dispatch.moveAt?.split(' ')[0]
    if (!dispatchAt) throw badRequest('Complete el campo de fecha de despacho')

    const [lastStock, lastStockAlmacen] = await Promise.all([
      invStockRepository.findOne({
        where: {
          warehouse_id: dispathBD.wareToId,
          status: StockStatus.CLOSED,
        },
        order: {
          stock_at: 'DESC',
        },
      }),
      invStockRepository.findOne({
        where: {
          warehouse_id: dispatch.wareFromId,
          status: StockStatus.CLOSED,
        },
        order: {
          stock_at: 'DESC',
        },
      }),
    ])
    if (lastStockAlmacen) {
      const dateLastStock = lastStockAlmacen.stock_at.split(' ')[0]
      const moveDispatchAt = dispatchAt
      const today = format(new Date(), 'yyyy-MM-dd')
      // comparar si date es mayor a la fecha del despacho
      // if (new Date(date) > new Date(moveDispatchAt)) {
      if (dateLastStock > moveDispatchAt) {
        throw badRequest(
          'Almacen : No se puede despachar en una fecha anterior al último inventario.',
        )
      }
      if (moveDispatchAt > today) {
        throw badRequest(
          'Almacen : No se puede despachar en una fecha posterior al dia de hoy.',
        )
      }
    }
    if (lastStock) {
      const dateLastStock = lastStock.stock_at.split(' ')[0]
      const moveDispatchAt = dispatchAt
      const today = format(new Date(), 'yyyy-MM-dd')
      // comparar si date es mayor a la fecha del despacho
      // if (new Date(date) > new Date(moveDispatchAt)) {
      if (dateLastStock > moveDispatchAt) {
        throw badRequest(
          'Tienda: No se puede despachar en una fecha anterior al último inventario.',
        )
      }
      if (moveDispatchAt > today) {
        throw badRequest(
          'Tienda: No se puede despachar en una fecha posterior al dia de hoy.',
        )
      }
    }

    const beforeDispatchAt = format(
      sub(parseISO(dispatchAt), { days: 1 }),
      'yyyy-MM-dd',
    )

    const nextSDispatchAt = format(
      add(parseISO(dispatch.moveAt!.split(' ')[0]), {
        days: 1,
      }),
      'yyyy-MM-dd',
    )

    const [lastStatusTienda, beforeStatusWarehouse, beforeStatusTienda] =
      await Promise.all([
        getStatusStock(dispatch.wareToId, nextSDispatchAt),
        getStatusStock(dispatch.wareFromId, beforeDispatchAt),
        getStatusStock(dispatch.wareToId, beforeDispatchAt),
      ])

    if (lastStock && lastStock.stock_at.split(' ')[0] != dispatchAt) {
      if (lastStatusTienda == StockStatus.CLOSED)
        throw badRequest(
          'Inventario de la tienda esta cerrado, no se puede despachar',
        )
      if (beforeStatusTienda != StockStatus.CLOSED) {
        throw badRequest(
          'Necesita cerrar el inventario de la tienda del dia anterior',
        )
      }

      if (
        beforeStatusWarehouse &&
        beforeStatusWarehouse != StockStatus.CLOSED
      ) {
        throw badRequest(
          'Necesita cerrar el inventario de almacen de la fecha ' +
            beforeDispatchAt,
        )
      }
    }

    const newItems = items?.filter((el) => !el.id) ?? []
    const itemsDB = await productItemRepository.find({
      where: {
        id: In(newItems.map((el) => el.itemId)),
      },
      relations: {
        presentation: true,
      },
    })

    const mapedNewItems: Partial<InvDispatchItem>[] = itemsDB
      .map((el) => {
        const item = newItems.find((item) => item.itemId == el.id)
        return {
          itemId: el.id,
          itemName: el.itemName,
          presentationId: el.presentationId,
          presentationName: el.presentation?.presentation ?? '',
          measureId: el.measureId,
          weight: 0,
          unitValue: el.unitPrice,
          quantity: item?.quantity ?? 0,
          totalValue: Number((el.unitPrice * (item?.quantity ?? 0)).toFixed(2)),
        }
      })
      .filter((el) => el.quantity > 0)

    await AppDataSource.transaction(async (manager) => {
      await invDispatchRepository.update(dispatch.id!, {
        ...dispatch,
        status: InvDispatchStatus.APPROVED,
      })

      if (items) {
        if (items.length == 0)
          await invDispatchItemRepository.delete({ dispatchId: dispatch.id })
        else {
          const promises: any[] = []
          for (const item of items) {
            // promises.push(invDispatchItemRepository.delete({ dispatchId: dispatch.id, itemId: item.itemId }))
            if (item.id) {
              if (item.quantity == 0) {
                promises.push(manager.delete(InvDispatchItem, { id: item.id }))
              } else {
                promises.push(
                  manager.update(
                    InvDispatchItem,
                    { id: item.id, dispatchId: dispatch.id },
                    item,
                  ),
                )
              }
            }
          }
          if (mapedNewItems.length > 0) {
            promises.push(
              manager.insert(
                InvDispatchItem,
                mapedNewItems.map((el) => ({ ...el, dispatchId: dispatch.id })),
              ),
            )
          }
          await Promise.all(promises)
        }
      }
    })

    const { id } = dispathBD

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

    res.json({ message: 'Actualizado y aprobado correctamente' })
  }

  @catchError
  async updateDispatchStatus(req: Request, res: Response) {
    const { id, status } = req.body as { id: number; status: InvDispatchStatus }
    const token: IToken = req.headers.token as unknown as IToken
    await invDispatchRepository.update(id, { status, approvedBy: token.name })
    res.json({ message: 'Actualizado correctamente' })
  }

  @catchError
  async filterDispatch(req: Request, res: Response) {
    const filters = req.body
    // const [dispatches, count, totalPage] =
    const {
      data: dispatches,
      count,
      totalPages,
      page,
    } = await invDispatchRepository.filter3(filters)

    // const today = format(new Date(), 'yyyy-MM-dd')
    res.json({
      data: {
        // dispatches: dispatches.map((el) => ({
        //   ...el,
        //   moveAt:
        //     el.status === InvDispatchStatus.NEW ||
        //     el.status === InvDispatchStatus.APPROVED
        //       ? today
        //       : el.moveAt,
        // })),
        dispatches,
        count,
        totalPages,
        page,
      },
    })
  }

  @catchError
  async getDispatchBase(req: Request, res: Response) {
    const { type } = req.query as { type: string }
    // const items = await dispatchBaseRepository.likeId(type)
    const data = await dispatchBaseRepository.getTemplatesForPos(type)

    res.json({
      data,
    })
  }

  @catchError
  async getBySucursal(req: Request, res: Response) {
    const {
      sucursalCode,
      start: _start,
      end: _end,
    } = req.query as {
      sucursalCode: string
      start: string
      end: string
    }
    const start = _start?.split(' ')[0] as string
    const end = _end?.split(' ')[0] as string
    const whereArr: any = [
      {
        wareTo: { sucursalId: sucursalCode },
      },
      {
        wareFrom: { sucursalId: sucursalCode },
      },
    ]
    if (start && end) {
      whereArr.map((el: any) => {
        el.moveAt = Raw((alias) => `DATE(${alias}) BETWEEN :start AND :end`, {
          start,
          end,
        })
      })
    }

    const lastDispatch = await invDispatchRepository.findOne({
      where: {
        wareTo: { id: sucursalCode },
        status: In([
          InvDispatchStatus.APPROVED,
          InvDispatchStatus.NEW,
          InvDispatchStatus.DISPATCHED,
        ]),
      },
      order: {
        moveAt: 'DESC',
      },
    })
    const lastDateDispatched = lastDispatch
      ? lastDispatch.moveAt.split(' ')[0]
      : null

    const dispatches = await invDispatchRepository.find({
      select: {
        wareTo: {
          id: true,
          name: true,
        },
        wareFrom: {
          id: true,
          name: true,
        },
      },
      where: whereArr,
      relations: {
        wareTo: true,
        wareFrom: true,
      },
    })
    res.json({
      data: dispatches,
      lastDispatch: lastDateDispatched,
    })
  }

  @catchError
  async getDispatch(req: Request, res: Response) {
    const findObject = req.body
    const dispatches = await invDispatchRepository.find(findObject)

    res.json({
      data: dispatches,
    })
  }

  @catchError
  async rejectDispatch(req: Request, res: Response) {
    const { id } = req.body
    const dispatch = await invDispatchRepository.findOne({ where: { id } })
    if (!dispatch) {
      return res.json({
        message: 'Despacho no encontrado',
      })
    }

    if (dispatch.status === InvDispatchStatus.DISPATCHED) {
      throw badRequest('Despacho ya fue inventariado')
    }

    await invDispatchRepository.update(id, {
      status: InvDispatchStatus.CANCELED,
    })

    return res.json({
      message: 'Despacho rechazado',
    })
  }

  @catchError
  async getDispatchById(req: Request, res: Response) {
    const { id } = req.query
    const dispatch = await invDispatchRepository.findOne({
      select: {
        id: true,
        wareFromId: true,
        wareToId: true,
        numInvoice: true,
        numGuide: true,
        gloss: true,
        moveAt: true,
        netValue: true,
        taxValue: true,
        docUrl: true,
        totalValue: true,
        status: true,
        createdBy: true,
        wareFrom: {
          id: true,
          name: true,
        },
        wareTo: {
          id: true,
          name: true,
        },
        items: {
          id: true,
          dispatchId: true,
          itemId: true,
          itemName: true,
          presentationId: true,
          unitValue: true,
          quantity: true,
          totalValue: true,
          item: {
            id: true,
            measure: {
              id: true,
              code: true,
              measure: true,
            },
          },
          presentation: {
            id: true,
            presentation: true,
          },
        },
      },
      where: { id: Number(id) },
      relations: {
        wareTo: true,
        wareFrom: true,
        items: {
          item: {
            measure: true,
            presentation: true,
          },
        },
      },
    })
    res.json({
      data: dispatch,
    })
  }

  @catchError
  async getWarehouse(req: Request, res: Response) {
    const findObject = req.body
    const dispatches = await invWarehouseRepository.find(findObject)

    res.json({
      data: dispatches,
    })
  }

  @catchError
  async getDispatchToday(req: Request, res: Response) {
    const { date } = req.query
    const data = await dispatchRepository.getListDispatchToday(date as string)
    res.json({ data })
  }

  @catchError
  async createDispatchAll(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const dispatch: InvDispatch = req.body
    dispatch.createdBy = token.name
    res.json({ data: dispatch })

    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, dispatch)
      const items = dispatch.items as InvDispatchItem[]
      for (const item of items) {
        item.dispatchId = result.raw.insertId
      }
      await manager.insert(InvDispatchItem, items)
    })

    res.json({ message: 'Creado correctamente' })
  }

  @catchError
  async approveDispatch(req: Request, res: Response) {
    const { id } = req.params
    // const posService = new PosService()
    // const numGuide = await posService.generarGuia(Number(id))
    await invDispatchRepository.update(id, {
      status: InvDispatchStatus.APPROVED,
      // numGuide: numGuide.toString(),
    })
    res.json({ message: 'Despacho aprobado' })
  }

  @catchError
  async saveApproveAndTransportista(req: Request, res: Response) {
    const { id } = req.params
    const body = req.body as ITransportista
    await invDispatchRepository.update(id, {
      ...body,
      transporte_tipo_doc: '6',
      conductor_tipo: 'Principal',
      status: InvDispatchStatus.APPROVED,
    })
    // const posService = new PosService()
    // const numGuide = await posService.generarGuia(Number(id))
    // await invDispatchRepository.update(id, {
    //   status: InvDispatchStatus.APPROVED,
    //   numGuide: numGuide.toString(),
    // })
    res.json({ message: 'Despacho aprobado' })
  }

  @catchError
  async getOrGenrateGuideDoc(req: Request, res: Response) {
    const { id } = req.params
    const dispatch = await invDispatchRepository.findOne({
      where: { id: Number(id) },
    })
    if (!dispatch) {
      throw badRequest('Despacho no encontrado')
    }
    if (dispatch.docUrl) {
      res.json({ data: { docUrl: dispatch.docUrl } })
      return
    } else {
      const posService = new PosService()
      const numGuide = await posService.generarGuia(Number(id))
      await invDispatchRepository.update(id, {
        numGuide: numGuide.CODIGO,
        docUrl: numGuide.PDF,
      })
      res.json({ data: { docUrl: numGuide.PDF } })
    }
  }

  @catchError
  async pdfIsAvailable(req: Request, res: Response) {
    const { url } = req.query
    const response = await axios.get(url as string)
    const isAvailable = response.status === 200

    res.json({ data: { isAvailable } })
  }

  @catchError
  async createDispatchFromTemplate(req: Request, res: Response) {
    const token = req.headers.token as unknown as IToken
    const { sucursalId, date, sucursalNombre } = req.body as {
      sucursalId: string
      date: string
      sucursalNombre: string
    }

    const templateStore = await dispatchRepository.getTemplates()

    const objectCreate: Partial<InvDispatch> & { storeId: string } = {
      storeId: sucursalId,
      wareToId: sucursalId,
      gloss: `Despacho ${sucursalNombre}`,
      moveAt: date,
      createdBy: token.name,
      status: 1,
      items: templateStore.map((el) => {
        return {
          itemId: el.itemId,
          quantity: el.quantity,
        }
      }) as InvDispatchItem[],
    }

    const dispatch = await createDispatchFN(objectCreate)
    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, dispatch)
      const items = dispatch.items as InvDispatchItem[]
      for (const item of items) {
        item.dispatchId = result.raw.insertId
      }
      await manager.insert(InvDispatchItem, items)
    })

    res.json({ message: 'Creado correctamente' })
  }
}
