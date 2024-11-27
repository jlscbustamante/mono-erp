import { format, parseISO, sub } from 'date-fns'
import { type Request, type Response } from 'express'

import { badRequest, notFound } from '@hapi/boom'
import { Carrier } from 'pizzadb'
import { AppDataSource } from '../../../config/database'
import {
  CreateDriverDto,
  DispatchCreateDto,
  DispatchItemAddDto,
  DispatchUpdateDto,
  MoveBetweenStoresDto,
  StockItemToCreateDto,
  UpdateDriverDto,
  UpdateSucursalDto,
} from '../../../core/inventory/dto'
import { CreateInitialStockDto } from '../../../core/inventory/dto/create_initial_stock.dto'
import {
  DISPATCH_STATUS,
  DispatchItem,
  DispatchTransport,
} from '../../../core/inventory/entities/dispatch'
import {
  WAREHOUSE_TYPE,
  WarehouseLegal,
} from '../../../core/inventory/entities/warehouse'
import { InvDispatch } from '../../../entities/inventory/Dispatch'
import { InvDispatchItem } from '../../../entities/inventory/DispatchItems'
import { Sucursal } from '../../../entities/Sucursal'
import { invDispatchRepository } from '../../../repositories/inventory/dispatch.repository'
import parameterRepository from '../../../repositories/parameter.repository'
import sucursalRepository from '../../../repositories/sucursal.repository'
import { IToken } from '../../../types'
import { IUserFilter3 } from '../../../types/filter'
import { catchError } from '../../../utils/decorators'
import {
  createDispatch,
  createInitialStockUseCase,
  dispatchItemsUseCase,
  dispatchService,
  dispatchUtil,
  driverService,
  generateTemplateDispatchUseCase,
  generateTemplateStockUseCase,
  inventoryService,
  readStockUseCase,
  saveStockUseCase,
  stockRepository,
  templateRepository,
  warehouseRepository,
  warhouseService,
} from '../dependencies'
import { FileService } from './file.service'

const fileService = new FileService()

export class HexInventoryController {
  async checkTemplates(req: Request, res: Response) {
    const listErrorsTiendas: string[] = []
    const listErrorsAlmacen: string[] = []
    const global: string[] = []
    try {
      const { store, warehouse } = await templateRepository.getTemplates()
      for (const el of store) {
        const itemInWarehouse = warehouse.find(
          (item) => item.itemDispatchId == el.itemDispatchId,
        )
        if (!itemInWarehouse)
          listErrorsTiendas.push(`"${el.getItemDispatch().name}`)
      }
      for (const el of warehouse) {
        const itemInStore = store.find(
          (item) => item.itemDispatchId == el.itemDispatchId,
        )

        if (!itemInStore) listErrorsAlmacen.push(`${el.getItemDispatch().name}`)
      }
    } catch (err: any) {
      const message = err?.message ?? 'Error interno. Contactar con soporte'
      global.push(message)
    }

    return res.json({
      message: 'ok',
      data: {
        store: listErrorsTiendas,
        warehouse: listErrorsAlmacen,
        global,
      },
    })
  }

  @catchError
  async stockByRange(req: Request, res: Response) {
    const { warehouse, start, end } = req.query as {
      warehouse: string
      start: string
      end: string
    }

    const data = await readStockUseCase.run(warehouse, {
      start,
      end,
    })

    return res.json({
      message: 'ok',
      data: data,
    })
  }

  @catchError
  async templateDispatch(req: Request, res: Response) {
    const { sucursalCode } = req.query as { sucursalCode: string }
    const template = await generateTemplateDispatchUseCase.run(sucursalCode)
    return res.json({
      data: template,
    })
  }

  @catchError
  async createInitialStock(req: Request, res: Response) {
    const { items, stockAt, storeCode } = req.body as CreateInitialStockDto
    await createInitialStockUseCase.run({
      items,
      stockAt,
      storeCode,
    })
    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async stockRangeAnyWarehouse(req: Request, res: Response) {
    const { type, start, end } = req.query as {
      type?: WAREHOUSE_TYPE
      start: string
      end: string
    }
    const data = await stockRepository.getAdvancedRangeStock({
      type,
      start,
      end,
    })
    return res.json({
      message: 'ok',
      data,
    })
  }

  @catchError
  async lastClosedDate(req: Request, res: Response) {
    const { warehouse } = req.query as { warehouse: string }
    const date = await stockRepository.getLastClosedDate(warehouse)
    res.json({
      data: date,
    })
  }

  @catchError
  async approveDispatch(req: Request, res: Response) {
    const dispatch = req.body as DispatchUpdateDto
    const token: IToken = req.headers.token as unknown as IToken
    await dispatchItemsUseCase.run(dispatch, token.name)
    res.json({
      data: 'ok',
    })
  }

  @catchError
  async approveDispatchWithoutValidation(req: Request, res: Response) {
    const dispatch = req.body as DispatchUpdateDto
    const token: IToken = req.headers.token as unknown as IToken
    await dispatchItemsUseCase.runWithoutValidate(dispatch, token.name)

    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async updateDispatch(req: Request, res: Response) {
    const dispatch = req.body as DispatchUpdateDto

    await dispatchService.updateDispatch(dispatch)

    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async approveMovement(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const movement = req.body as MoveBetweenStoresDto
    await dispatchUtil.saveMoveBetweenStores(movement, token.name)
    // await moveBetweenStoresUseCase.run(movement)
    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async createDispatchAndApprove(req: Request, res: Response) {
    const token = req.headers.token as unknown as IToken
    const movement = req.body as DispatchCreateDto

    await createDispatch.run(movement, DISPATCH_STATUS.DISPATCHED, token?.name)

    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async createDispatchException(req: Request, res: Response) {
    const token = req.headers.token as unknown as IToken
    const movement = req.body as DispatchCreateDto

    // await createDispatch.createException(movement, token?.name)
    await dispatchUtil.saveDispatchException(movement, token.name)

    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async storePurchase(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const { id } = req.body as { id: number }
    // await storePurchaseUseCase.run(id, token.name)
    await dispatchUtil.storePurchase(id, token.name)
    res.json({
      message: 'ok',
    })
  }

  @catchError
  async revertStorePurchase(req: Request, res: Response) {
    const { id } = req.body as { id: number }
    // await storePurchaseUseCase.run(id, token.name)
    await dispatchUtil.revertStorePurchase(id)
    res.json({
      message: 'ok',
    })
  }

  @catchError
  async getWarehouses(req: Request, res: Response) {
    const warehouses = await warehouseRepository.getWarehouses()
    return res.json({ data: warehouses })
  }

  @catchError
  async lastClosedWarehouse(req: Request, res: Response) {
    const { warehouseCode } = req.query as {
      warehouseCode: string
    }
    const closedDate = await stockRepository.getLastClosedDate(warehouseCode)
    return res.json({
      message: 'ok',
      data: {
        date: closedDate,
      },
    })
  }

  @catchError
  async getEditTemplate(req: Request, res: Response) {
    const { warehouse, date } = req.query as { warehouse: string; date: string }
    const template = await generateTemplateStockUseCase.run(warehouse, date)
    return res.json({
      message: 'ok',
      data: template,
    })
  }

  @catchError
  async saveStock(req: Request, res: Response) {
    const { stock, date, warehouse } = req.body as {
      stock: StockItemToCreateDto[]
      date: string
      warehouse: string
    }
    await saveStockUseCase.run(stock, date, warehouse, true)
    return res.json({
      message: 'ok',
    })
  }

  @catchError
  async infoWarehouses(req: Request, res: Response) {
    const warehouses = await warehouseRepository.getWarehousesByType(
      WAREHOUSE_TYPE.WAREHOUSE,
    )
    if (warehouses.length == 0) {
      return res.json({
        message: 'ok',
        data: [],
      })
    }
    const today = format(new Date(), 'yyyy-MM-dd')
    const yesterday = format(sub(parseISO(today), { days: 1 }), 'yyyy-MM-dd')
    const infoPromises = await Promise.all(
      warehouses.map((el) => stockRepository.getLastClosedDate(el.code)),
    )

    const info: { code: string; message: string }[] = []
    for (let i = 0; i < warehouses.length; i++) {
      const closedDate = infoPromises[i]
      const warehouse = warehouses[i]
      if (closedDate == null) continue
      else {
        if (closedDate == today) continue
        else if (closedDate == yesterday) continue
        else
          info.push({
            code: warehouse.code,
            message: `El almacén "${warehouse.name}" no tiene inventario el día de ayer`,
          })
      }
    }

    return res.json({
      message: 'ok',
      data: info,
    })
  }

  @catchError
  async getDispatch(req: Request, res: Response) {
    const { id } = req.params
    const dispatch = await dispatchService.getDispatch(Number(id))
    return res.json({
      message: 'ok',
      data: dispatch,
    })
  }

  @catchError
  async getDispatches(req: Request, res: Response) {
    const { date } = req.query as { date: string }
    const dispatches = await dispatchService.getDispatches(date)
    return res.json({
      message: 'ok',
      data: dispatches,
    })
  }

  @catchError
  async invoiceAndGenerateGuide(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const { dispatchId, transport } = req.body as {
      dispatchId: number
      transport: DispatchTransport | null
    }
    await inventoryService.invoiceAndGuideDispatch(
      dispatchId,
      transport,
      token?.name ?? 'sys',
    )
    return res.json({ message: 'ok' })
  }

  @catchError
  async invoiceDispatch(req: Request, res: Response) {
    const { dispatchId } = req.body as { dispatchId: number }
    const data = await inventoryService.invoiceDispatch(dispatchId)
    return res.json({ message: 'ok', data })
  }

  @catchError
  async generateGuide(req: Request, res: Response) {
    const { dispatchId } = req.body as { dispatchId: number }
    const data = await inventoryService.generateGuideDispatch(dispatchId)
    return res.json({ message: 'ok', data })
  }

  @catchError
  async generateGuideWithTransport(req: Request, res: Response) {
    const { dispatchId, ...data } = req.body as {
      dispatchId: number
    } & DispatchTransport
    const guideNumber = await inventoryService.generateGuideWithTransport(
      dispatchId,
      data,
    )
    return res.json({ message: 'ok', data: guideNumber })
  }

  @catchError
  async testGetBodyInvoice(req: Request, res: Response) {
    const { dispatchId } = req.body as { dispatchId: number }
    const { scheme, correlative } =
      await inventoryService.generateBodyToInvoice(dispatchId)
    return res.json({ message: 'ok', data: { scheme, correlative } })
  }

  @catchError
  async testGetBodyGuide(req: Request, res: Response) {
    const { dispatchId } = req.body as { dispatchId: number }
    const { scheme, correlative } =
      await inventoryService.generateBodyToGuide(dispatchId)
    return res.json({ message: 'ok', data: { scheme, correlative } })
  }

  @catchError
  async testGetBodyGuideWithTransport(req: Request, res: Response) {
    const { dispatchId, ...data } = req.body as {
      dispatchId: number
    } & DispatchTransport
    const { scheme, correlative } =
      await inventoryService.generateBodyToGuideWithTransport(dispatchId, data)
    return res.json({ message: 'ok', data: { scheme, correlative } })
  }

  @catchError
  async getItems(req: Request, res: Response) {
    const items = await inventoryService.getItems()
    return res.json({
      message: 'ok',
      data: items,
    })
  }

  async getItemsFormatted(req: Request, res: Response) {
    const items = await inventoryService.getItems()
    const formated = items.map((el) => {
      const { storePrice, warehousePrice, ...rest } = el
      return {
        ...rest,
        price: storePrice,
        cost: warehousePrice,
      }
    })
    return res.json({
      message: 'ok',
      data: formated,
    })
  }

  @catchError
  async modifyDispatched(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const { dispatchId, ...dispatchdispatch } = req.body as {
      dispatchId: number
      toCreate: DispatchItemAddDto[]
      toUpdate: DispatchItem[]
      toDelete: DispatchItem[]
      taxValue: number
    }
    // await inventoryService.modifyDispatched(dispatchId, dispatchdispatch)
    await dispatchUtil.updateDispatched(
      {
        dispatchId,
        ...dispatchdispatch,
      },
      token?.name ?? 'sys',
    )

    return res.json({ message: 'ok' })
  }

  @catchError
  async simpleDispatch(req: Request, res: Response) {
    const { dispatchId, wareFromId, dispatchDate } = req.body as {
      dispatchId: number
      wareFromId: string | undefined
      dispatchDate: string
    }
    const token = req.headers?.token as unknown as IToken
    await dispatchService.simpleDispatch(
      dispatchId,
      token?.name,
      dispatchDate,
      wareFromId,
    )
    return res.json({ message: 'ok' })
  }

  // DRIVERS

  @catchError
  async getDrivers(req: Request, res: Response) {
    const drivers = await driverService.getAllDrivers()
    return res.json({
      message: 'ok',
      data: drivers,
    })
  }

  @catchError
  async getWarehousesLegal(req: Request, res: Response) {
    const warehouses = await warhouseService.getWarehouses()
    return res.json({
      message: 'ok',
      data: warehouses,
    })
  }

  @catchError
  async createWarehouse(req: Request, res: Response) {
    const warehouse = req.body as WarehouseLegal
    await warhouseService.createWarehouse(warehouse)
    return res.json({ message: 'Creado correctamente' })
  }

  @catchError
  async updateWarehouse(req: Request, res: Response) {
    const warehouse = req.body as WarehouseLegal
    await warhouseService.updateWarehouse(warehouse)
    return res.json({ message: 'Actualizado correctamente' })
  }

  @catchError
  async drivers(req: Request, res: Response) {
    const drivers = await driverService.drivers()
    return res.json({
      message: 'ok',
      data: drivers,
    })
  }

  @catchError
  async filterDrivers(req: Request, res: Response) {
    const filters = req.body as IUserFilter3<Carrier>
    const drivers = await driverService.filterDrivers(filters)
    return res.json({
      message: 'ok',
      data: drivers,
    })
  }

  @catchError
  async createDriver(req: Request, res: Response) {
    const data = req.body as CreateDriverDto

    await driverService.createDriver(data)
    return res.json({ message: 'ok' })
  }

  @catchError
  async updateDriver(req: Request, res: Response) {
    const data = req.body as UpdateDriverDto

    await driverService.updateDriver(data)
    return res.json({ message: 'ok' })
  }

  @catchError
  async deleteDriver(req: Request, res: Response) {
    const { id } = req.params
    await driverService.delete(Number(id))
    return res.json({ message: 'ok' })
  }

  @catchError
  async getWarehouseRoutes(req: Request, res: Response) {
    const data = await warhouseService.getWarehouseRoutes()
    return res.json({
      data,
    })
  }

  @catchError
  async updateWarehouseRoutes(req: Request, res: Response) {
    const { route, warehouseIds } = req.body as {
      route: string
      warehouseIds: string[]
    }
    const data = await warhouseService.updateWarehouseRoutes(
      warehouseIds,
      route,
    )
    return res.json({
      data,
    })
  }

  @catchError
  async getDispatchByRoute(req: Request, res: Response) {
    const { date, route } = req.query as {
      date: string
      route: string
    }
    const data = await dispatchService.dispatchByRoute(date, route)
    return res.json({ data, message: 'ok' })
  }

  @catchError
  async getDispatchConsolidation(req: Request, res: Response) {
    const { start, end } = req.query as {
      start: string
      end: string
    }
    const data = await dispatchService.dispatchConsolidation(start, end)

    return res.json({
      data,
      message: 'ok',
    })
  }

  @catchError
  async zipedFiles(req: Request, res: Response) {
    const { files } = req.body as {
      files: {
        doc_url: string
        doc_operacion: string
        warehouseId: string
      }[]
    }

    await fileService.downloadAndZiped(files, res)
  }

  @catchError
  async defaultWarehouse(req: Request, res: Response) {
    const parameter = await parameterRepository.findOne({
      where: {
        type: 'WAREHOUSE_DEFAULT',
      },
    })
    if (parameter && parameter.value) {
      return res.json({ data: parameter.value })
    }
    const warehouse = await sucursalRepository.findOne({
      where: {
        type_sede: WAREHOUSE_TYPE.WAREHOUSE,
      },
      order: {
        created_at: 'DESC',
      },
    })
    if (!warehouse) return res.json({ data: null })
    return res.json({ data: warehouse.id })
  }

  @catchError
  async divideDispatch(req: Request, res: Response) {
    const data = req.body as {
      dispatchId: number
      relation: {
        dispatchItemId: number
        warehouseId: string
      }[]
    }
    const warehouseCodes = Array.from(
      new Set(data.relation.map((item) => item.warehouseId)),
    )
    if (warehouseCodes.length <= 1) {
      throw badRequest('No se puede dividir despachos con el mismo origen')
    }

    const dispatch = await invDispatchRepository.findOne({
      where: {
        id: data.dispatchId,
      },
      relations: {
        items: true,
      },
    })
    if (!dispatch) throw notFound('No se encontro el despacho')
    const items = dispatch.items ?? []
    const invDispatches = warehouseCodes.map((w) => {
      const itemDp = items
        .filter((item) => {
          const relation = data.relation.find(
            (el) => el.dispatchItemId == item.id,
          )
          return relation?.warehouseId == w
        })
        .map((el) => ({ ...el, id: undefined, dispatchId: undefined }))
      const netValue = itemDp.reduce((acc, el) => acc + el.totalValue, 0)
      return {
        ...dispatch,
        taxValue: 0,
        netValue,
        totalValue: netValue,
        id: undefined,
        wareFromId: w,
        items: itemDp,
      }
    })

    await AppDataSource.transaction(async (manager) => {
      await manager.delete(InvDispatchItem, {
        dispatchId: data.dispatchId,
      })
      await manager.delete(InvDispatch, { id: data.dispatchId })
      for (const dispatch of invDispatches) {
        const { items, ...restDispatch } = dispatch
        const result = await manager.insert(InvDispatch, restDispatch)
        const insertId = result.raw.insertId
        if (!items) throw new Error('No se encontro id del despacho')
        await manager.insert(
          InvDispatchItem,
          items.map((el) => ({ ...el, dispatchId: insertId })),
        )
      }
    })

    return res.json({ message: 'ok' })
  }

  @catchError
  async sucursalUpdate(req: Request, res: Response) {
    const { stores } = req.body as {
      stores: UpdateSucursalDto[]
    }

    const sucursales: Sucursal[] = []

    for (const store of stores) {
      const sucursal = new Sucursal()
      sucursal.id = store.id
      sucursal.title = store.title
      sucursal.codefis = store.id
      sucursal.ubi_address = store.ubi_address
      sucursal.ubi_district = store.ubi_district
      sucursal.ubi_city = store.ubi_city || 'LIMA'
      sucursal.sede_nro_ruc = store.sede_nro_ruc
      sucursal.legalperson_name = store.sede_razon_social
      sucursal.efact_pass = store.efact_pass
      sucursal.cfd_serie = store.cfd_serie_fa
      if (store.cfd_seql_fa) sucursal.cfd_correlativo = store.cfd_seql_fa
      sucursal.cfd_serie_bo = store.cfd_serie_bo
      if (store.cfd_seql_bo) sucursal.cfd_seql_bo = store.cfd_seql_bo
      sucursal.status = store.status
      sucursal.type_sede = 'T'

      sucursales.push(sucursal)
    }
    await sucursalRepository.save(sucursales)

    return res.json({ message: 'ok' })
  }

  @catchError
  async getConsolidateByItem(req: Request, res: Response) {
    const { date, itemId } = req.query as { date: string; itemId: string }

    const consolidates = await dispatchService.getConsolidateItem(
      date,
      Number(itemId),
    )
    return res.json({ data: consolidates, message: 'ok' })
  }

  @catchError
  async resetDispatch(req: Request, res: Response) {
    const { id } = req.body as { id: number }

    await dispatchUtil.resetDispatch(id)

    return res.json({ message: 'ok' })
  }

  @catchError
  async resetAndDeleteDispatch(req: Request, res: Response) {
    const { id } = req.body as { id: number }

    await dispatchUtil.resetAndDeleteDispatch(id)

    return res.json({ message: 'ok' })
  }

  @catchError
  async getListPrice(req: Request, res: Response) {
    const data = await inventoryService.getListPrice()
    return res.json({ message: 'ok', data: data })
  }

  @catchError
  async getRelationItem(req: Request, res: Response) {
    const { itemId } = req.query as { itemId: string }
    const id = parseInt(itemId)
    const data = await inventoryService.getRelationItem(id)
    return res.json({ message: 'ok', data: data })
  }

  @catchError
  async updatePrice(req: Request, res: Response) {
    const { itemId, price, cost } = req.body as {
      itemId: number
      price: number
      cost: number
    }
    await inventoryService.updatePrice(itemId, { cost, price })
    return res.json({ message: 'ok' })
  }
}
