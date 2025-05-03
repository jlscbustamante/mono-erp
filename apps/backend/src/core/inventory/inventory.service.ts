import { badRequest } from '@hapi/boom'

import { format } from 'date-fns'
import { InvDispatch, InvDispatchItem, InvStock, Item, Sucursal } from 'pizzadb'
import { In, Raw, Repository } from 'typeorm'
import config from '../../config/config'
import { AppDataSource } from '../../config/database'
import {
  generateGuideApi,
  generateGuideWithTransportApi,
} from '../../lib/api/generate-guide'
import { generateInvoiceApi } from '../../lib/api/invoice'
import { ItemRelationship } from '../../types/inventory/item'
import {
  GuideSchema,
  GuideSchemaItem,
  GuideWithTransportScheme,
  InvoiceSchema,
  InvoiceSchemaItem,
} from '../common/types'
import { DispatchItemAddDto } from './dto'
import {
  DISPATCH_STATUS,
  DispatchItem,
  DispatchTransport,
} from './entities/dispatch'
import { DispatchRepository } from './entities/repositories/dispatch.repository'
import { ItemRepository } from './entities/repositories/item.repository'
import { TemplateRepository } from './entities/repositories/template.repository'
import { WarehousesRepository } from './entities/repositories/warehouses.repository'
import { TemplateItem } from './entities/template_item'
import { WarehouseLegal } from './entities/warehouse'

export class InventoryService {
  constructor(
    private readonly dispatchRepository: DispatchRepository,
    private readonly itemRepository: ItemRepository,
    private readonly warehouseRepository: WarehousesRepository,
    private readonly templateRepository: TemplateRepository,
    private readonly stockRepository: Repository<InvStock>,
    private readonly invItemRepository: Repository<Item>,
  ) {}

  async invoiceAndGuideDispatch(
    dispatchId: number,
    transport: DispatchTransport | null,
    _username: string,
  ) {
    const {
      dispatch,
      guideCorrelative,
      guideSchema,
      invoiceCorrelative,
      wareFrom,
      invoiceSchema,
    } = await this.generateLegalSchemas(dispatchId, transport)

    if (dispatch.status != DISPATCH_STATUS.DISPATCHED)
      throw badRequest('El despacho aún no ha sido despachado')

    if (guideSchema.store_from.nro_ruc == guideSchema.store_to.nro_ruc)
      throw badRequest('No se puede facturar a la misma razón social')

    const invoiceNumber = await generateInvoiceApi(invoiceSchema)

    let guideNumber = ''
    try {
      guideSchema.efact_document = invoiceNumber
      if ('dispatch' in guideSchema) {
        guideNumber = await generateGuideWithTransportApi(guideSchema)
      } else {
        guideNumber = await generateGuideApi(guideSchema)
      }
    } catch (err) {
      console.log('Error guia del despacho : ', dispatchId)
    }

    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvDispatch,
        { id: dispatchId },
        {
          numInvoice: invoiceNumber,
          numGuide: guideNumber,
          status: DISPATCH_STATUS.INVOICED as any,
          conductor_nro_doc: transport?.driverDocumentNumber ?? '',
          conductor_tipo_doc: transport?.driverDocumentType ?? '',
          conductor_nombres: transport?.driverFirstName ?? '',
          conductor_apellidos: transport?.driverLastName ?? '',
          conductor_nro_licencia: transport?.driverLicenseNumber ?? '',
          transporte_nro_placa: transport?.licensePlateNumber ?? '',
          transporte_razon_social: transport?.transportCompanyName ?? '',
        },
      )
      const update: {
        cfd_correlativo: number
        guide_correlativo?: number
      } = {
        cfd_correlativo: invoiceCorrelative,
      }
      if (guideNumber != '') {
        update['guide_correlativo'] = guideCorrelative
      }
      await manager.update(
        Sucursal,
        {
          id: wareFrom.code,
        },
        update,
        // {
        //   cfd_correlativo: invoiceCorrelative,
        //   guide_correlativo:
        //     guideNumber != '' ? guideCorrelative + 1 : guideCorrelative,
        // },
      )
    })

    // await kardexService.generateFromDispatch(dispatchId, username)
  }

  async invoiceDispatch(dispatchId: number) {
    const { correlative, scheme, wareFrom, dispatch } =
      await this.generateBodyToInvoice(dispatchId)
    if (dispatch.status != DISPATCH_STATUS.DISPATCHED) {
      throw badRequest('El despacho aún no ha sido despachado')
    }
    const invoiceNumber = await generateInvoiceApi(scheme)
    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvDispatch,
        { id: dispatchId },
        { numInvoice: invoiceNumber, status: DISPATCH_STATUS.INVOICED as any },
      )
      await manager.update(
        Sucursal,
        { id: wareFrom.code },
        {
          cfd_correlativo: correlative,
        },
      )
    })

    return invoiceNumber
  }

  async generateGuideDispatch(dispatchId: number) {
    const { scheme, dispatch, wareFrom, correlative } =
      await this.generateBodyToGuide(dispatchId)
    if (dispatch.status != DISPATCH_STATUS.INVOICED) {
      throw badRequest('Para generar la guia, el despacho debe estar facturado')
    }
    const invoiceNumber = await generateGuideApi(scheme)
    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvDispatch,
        { id: dispatchId },
        {
          numGuide: invoiceNumber,
          status: DISPATCH_STATUS.INVOICED_WITH_TRACKING as any,
        },
      )
      await manager.update(
        Sucursal,
        { id: wareFrom.code },
        {
          guide_correlativo: correlative,
        },
      )
    })

    return invoiceNumber
  }

  async generateGuideWithTransport(
    dispatchId: number,
    data: DispatchTransport,
  ) {
    const {
      guideSchema: scheme,
      dispatch,
      guideCorrelative: correlative,
      wareFrom,
    } = await this.generateLegalSchemas(dispatchId, data)
    if (dispatch.status != DISPATCH_STATUS.INVOICED) {
      throw badRequest('Para generar la guia, el despacho debe estar facturado')
    }

    scheme.efact_document = dispatch.numInvoice ?? ''
    const invoiceNumber = await generateGuideWithTransportApi(
      scheme as GuideWithTransportScheme,
    )
    await AppDataSource.transaction(async (manager) => {
      await manager.update(
        InvDispatch,
        { id: dispatchId },
        {
          numGuide: invoiceNumber,
          status: DISPATCH_STATUS.INVOICED as any,
          conductor_nro_doc: data.driverDocumentNumber,
          conductor_tipo_doc: data.driverDocumentType,
          conductor_nombres: data.driverFirstName,
          conductor_apellidos: data.driverLastName,
          conductor_nro_licencia: data.driverLicenseNumber,
          transporte_nro_placa: data.licensePlateNumber,
          transporte_razon_social: data.transportCompanyName,
        },
      )
      await manager.update(
        Sucursal,
        { id: wareFrom.code },
        {
          guide_correlativo: correlative,
        },
      )
    })

    return invoiceNumber
  }

  async generateBodyToInvoice(dispatchId: number) {
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const [wareFrom, wareTo] = await Promise.all([
      this.warehouseRepository.getWarehouseLegal(dispatch.wareFromId),
      this.warehouseRepository.getWarehouseLegal(dispatch.wareToId),
    ])
    if (!wareFrom || !wareTo) throw new Error('Tienda no encontrada')
    this.validateWarehouseLegal(wareFrom)
    this.validateWarehouseLegal(wareTo)
    if (!wareFrom.serie)
      throw new Error('Serie no encontrada - ' + wareFrom.legalName)

    const correlative = wareFrom.correlativo + 1
    const serie = wareFrom.serie

    const invoiceSchema: InvoiceSchema = {
      store_direction: wareFrom.legalAddress,
      store_ruc: wareFrom.legalNumber,
      store_name: wareFrom.name,
      store_nro_doc: wareFrom.legalNumber,
      store_serie: serie,
      store_id: wareFrom.code,
      store_correlativo: correlative.toString(),
      store_razon_social: wareFrom.legalName,
      client_razon_social: wareTo.legalName,
      client_email: null,
      client_nro_doc: wareTo.legalNumber,
      client_direction: wareTo.legalAddress,
      orden_nro: dispatch.id,
      total_price: dispatch.totalValue,
      company_id: config.companyName,
      items: dispatch.items.map(
        (el) =>
          ({
            description: el.itemName,
            id: el.id,
            price: el.unitValue,
            quantity: el.quantity,
          }) satisfies InvoiceSchemaItem,
      ),
    }
    return {
      scheme: invoiceSchema,
      correlative,
      wareFrom,
      dispatch,
    }
  }

  async generateBodyToGuide(dispatchId: number) {
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const [wareFrom, wareTo] = await Promise.all([
      this.warehouseRepository.getWarehouseLegal(dispatch.wareFromId),
      this.warehouseRepository.getWarehouseLegal(dispatch.wareToId),
    ])
    if (!wareFrom || !wareTo) throw new Error('Tienda no encontrada')

    this.validateWarehouseLegal(wareFrom)
    this.validateWarehouseLegal(wareTo)

    if (!wareFrom.guideSerie)
      throw new Error('Serie no encontrada - ' + wareFrom.legalName)

    const correlative = wareFrom.guideCorrelativo + 1
    const serie = wareFrom.guideSerie

    const guideSchema: GuideSchema = {
      efact_document: '',
      store_from: {
        store_id: wareFrom.code,
        cfd_serie: serie,
        cfd_correlativo: correlative.toString(),
        street_name: wareFrom.legalAddress,
        title: wareFrom.name,
        nro_ruc: wareFrom.legalNumber,
        razon_social: wareFrom.legalName,
        district: wareFrom.district,
      },
      store_to: {
        street_name: wareTo.legalAddress,
        title: wareTo.name,
        nro_ruc: wareTo.legalNumber,
        razon_social: wareTo.legalName,
        district: wareTo.district,
      },
      dispatch_items: dispatch.items.map(
        (el) =>
          ({
            dispatch_order: dispatch.id.toString(),
            product_id: el.id.toString(),
            quantity: el.quantity.toString(),
            unit_value: el.unitValue.toString(),
            item_name: el.itemName,
            mesure_code: 'KG',
          }) satisfies GuideSchemaItem,
      ),
    }
    return {
      scheme: guideSchema,
      correlative,
      wareFrom,
      dispatch,
    }
  }

  async generateLegalSchemas(
    dispatchId: number,
    transport: DispatchTransport | null = null,
  ) {
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const [wareFrom, wareTo] = await Promise.all([
      this.warehouseRepository.getWarehouseLegal(dispatch.wareFromId),
      this.warehouseRepository.getWarehouseLegal(dispatch.wareToId),
    ])

    if (!wareFrom || !wareTo) throw new Error('Tienda no encontrada')
    this.validateWarehouseLegal(wareFrom)
    this.validateWarehouseLegal(wareTo)
    if (!wareFrom.guideSerie || !wareFrom.serie)
      throw new Error('Serie no encontrada - ' + wareFrom.legalName)
    // if (!wareTo.guideSerie || !wareTo.serie)
    //   throw new Error('Serie no encontrada - ' + wareFrom.legalName)

    const invoiceSerie = wareFrom.serie
    const invoiceCorrelative = wareFrom.correlativo + 1

    const guideSerie = wareFrom.guideSerie
    const guideCorrelative = wareFrom.guideCorrelativo + 1

    const invoiceSchema: InvoiceSchema = {
      store_direction: wareFrom.legalAddress,
      store_ruc: wareFrom.legalNumber,
      store_name: wareFrom.name,
      store_nro_doc: wareFrom.legalNumber,
      store_serie: invoiceSerie,
      store_id: wareFrom.code,
      store_correlativo: invoiceCorrelative.toString(),
      store_razon_social: wareFrom.legalName,
      client_razon_social: wareTo.legalName,
      client_email: null,
      client_nro_doc: wareTo.legalNumber,
      client_direction: wareTo.legalAddress,
      orden_nro: dispatch.id,
      total_price: dispatch.totalValue,
      company_id: config.companyName,
      items: dispatch.items.map(
        (el) =>
          ({
            description: el.itemName,
            id: el.id,
            price: el.unitValue,
            quantity: el.quantity,
          }) satisfies InvoiceSchemaItem,
      ),
    }

    let guideSchema: GuideSchema | GuideWithTransportScheme
    if (!transport) {
      guideSchema = {
        efact_document: '',
        store_from: {
          store_id: wareFrom.code,
          cfd_serie: guideSerie,
          cfd_correlativo: guideCorrelative.toString(),
          street_name: wareFrom.legalAddress,
          title: wareFrom.name,
          nro_ruc: wareFrom.legalNumber,
          razon_social: wareFrom.legalName,
          district: wareFrom.district,
        },
        store_to: {
          street_name: wareTo.legalAddress,
          title: wareTo.name,
          nro_ruc: wareTo.legalNumber,
          razon_social: wareTo.legalName,
          district: wareTo.district,
        },
        dispatch_items: dispatch.items.map(
          (el) =>
            ({
              dispatch_order: dispatch.id.toString(),
              product_id: el.id.toString(),
              quantity: el.quantity.toString(),
              unit_value: el.unitValue.toString(),
              item_name: el.itemName,
              mesure_code: 'KG',
            }) satisfies GuideSchemaItem,
        ),
      } satisfies GuideSchema
    } else {
      guideSchema = {
        efact_document: '',
        store_from: {
          store_id: wareFrom.code,
          cfd_serie: guideSerie,
          cfd_correlativo: guideCorrelative.toString(),
          street_name: wareFrom.legalAddress,
          title: wareFrom.name,
          nro_ruc: wareFrom.legalNumber,
          razon_social: wareFrom.legalName,
          district: wareFrom.district,
        },
        store_to: {
          street_name: wareTo.legalAddress,
          title: wareTo.name,
          nro_ruc: wareTo.legalNumber,
          razon_social: wareTo.legalName,
          district: wareTo.district,
        },
        dispatch: {
          conductor_apellidos: transport.driverLastName,
          conductor_nombres: transport.driverFirstName,
          conductor_nro_doc: transport.driverDocumentNumber,
          conductor_nro_licencia: transport.driverLicenseNumber,
          conductor_tipo_doc: transport.driverDocumentType,
          transporte_nro_placa: transport.licensePlateNumber,
          transporte_razon_social: transport.transportCompanyName,
        },
        dispatch_items: dispatch.items.map(
          (el) =>
            ({
              dispatch_order: dispatch.id.toString(),
              product_id: el.id.toString(),
              quantity: el.quantity.toString(),
              unit_value: el.unitValue.toString(),
              item_name: el.itemName,
              mesure_code: 'KG',
            }) satisfies GuideSchemaItem,
        ),
      } satisfies GuideWithTransportScheme
    }

    return {
      guideSchema,
      invoiceSchema,
      invoiceCorrelative,
      guideCorrelative,
      dispatch,
      wareFrom,
    }
  }

  async generateBodyToGuideWithTransport(
    dispatchId: number,
    transportData: DispatchTransport,
  ) {
    const dispatch =
      await this.dispatchRepository.getOneLegalDispatch(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const [wareFrom, wareTo] = await Promise.all([
      this.warehouseRepository.getWarehouseLegal(dispatch.wareFromId),
      this.warehouseRepository.getWarehouseLegal(dispatch.wareToId),
    ])
    if (!wareFrom || !wareTo) throw new Error('Tienda no encontrada')

    this.validateWarehouseLegal(wareFrom)
    this.validateWarehouseLegal(wareTo)

    if (!wareFrom.guideSerie) {
      throw new Error('Serie no encontrada - ' + wareFrom.legalName)
    }

    const correlative = wareFrom.guideCorrelativo
    const serie = wareFrom.guideSerie

    const guideSchema: GuideWithTransportScheme = {
      efact_document: '',
      store_from: {
        store_id: wareFrom.code,
        cfd_serie: serie,
        cfd_correlativo: correlative.toString(),
        street_name: wareFrom.legalAddress,
        title: wareFrom.name,
        nro_ruc: wareFrom.legalNumber,
        razon_social: wareFrom.legalName,
        district: wareFrom.district,
      },
      store_to: {
        street_name: wareTo.legalAddress,
        title: wareTo.name,
        nro_ruc: wareTo.legalNumber,
        razon_social: wareTo.legalName,
        district: wareTo.district,
      },
      dispatch: {
        conductor_apellidos: transportData.driverLastName,
        conductor_nombres: transportData.driverFirstName,
        conductor_nro_doc: transportData.driverDocumentNumber,
        conductor_nro_licencia: transportData.driverLicenseNumber,
        conductor_tipo_doc: transportData.driverDocumentType,
        transporte_nro_placa: transportData.licensePlateNumber,
        transporte_razon_social: transportData.transportCompanyName,
      },
      dispatch_items: dispatch.items.map(
        (el) =>
          ({
            dispatch_order: dispatch.id.toString(),
            product_id: el.id.toString(),
            quantity: el.quantity.toString(),
            unit_value: el.unitValue.toString(),
            item_name: el.itemName,
            mesure_code: 'KG',
          }) satisfies GuideSchemaItem,
      ),
    }
    return {
      scheme: guideSchema,
      correlative,
      wareFrom,
      dispatch,
    }
  }

  private validateWarehouseLegal(warehouse: WarehouseLegal) {
    if (
      !warehouse.legalNumber ||
      !warehouse.legalName ||
      !warehouse.legalAddress
    ) {
      throw new Error(
        'Completa los datos legales de la tienda - ' + warehouse.name,
      )
    }
  }

  async getItems() {
    const items = await this.itemRepository.getActiveItems()
    return items
  }

  async modifyDispatched(
    dispatchId: number,
    {
      toCreate,
      toUpdate,
      toDelete,
    }: {
      toCreate: DispatchItemAddDto[]
      toUpdate: DispatchItem[]
      toDelete: DispatchItem[]
      taxValue: number
    },
  ) {
    if (toCreate.length == 0 && toUpdate.length == 0 && toDelete.length == 0) {
      throw new Error('No hay items para modificar')
    }
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const [templateFrom, templateTo] = await Promise.all([
      this.templateRepository.getTemplate(true),
      this.templateRepository.getTemplate(false),
    ])
    const [stockFrom, stockTo] = await Promise.all([
      this.stockRepository.find({
        where: {
          warehouse_id: dispatch.wareFromId,
          stock_at: Raw((alias) => `DATE(${alias}) = '${dispatch.dispatchAt}'`),
        },
      }),
      this.stockRepository.find({
        where: {
          warehouse_id: dispatch.wareToId,
          stock_at: Raw((alias) => `DATE(${alias}) = '${dispatch.dispatchAt}'`),
        },
      }),
    ])
    const newItems: DispatchItem[] = [
      ...dispatch.items
        .filter((el) => !toDelete.find((el2) => el.id == el2.id))
        .filter((el) => !toUpdate.find((el2) => el.id == el2.id)),
      ...toCreate.map(
        (el) =>
          ({
            ...el,
            id: -1,
            measureCode: '',
          }) satisfies DispatchItem,
      ),
      ...toUpdate,
    ]

    const netValue = newItems.reduce((acc, el) => acc + el.totalValue, 0)
    const total = netValue + dispatch.taxValue

    const invStocks = this.getModifierHelpers({
      items: dispatch.items,
      stockFrom: stockFrom,
      stockTo: stockTo,
      templateFrom: templateFrom,
      templateTo: templateTo,
      newItems,
      date: dispatch.dispatchAt,
      wareFromId: dispatch.wareFromId,
      wareToId: dispatch.wareToId,
    })

    await AppDataSource.transaction(async (manager) => {
      const updates = []
      for (const item of invStocks) {
        if (item.id) {
          updates.push(
            manager.update(
              InvStock,
              {
                id: item.id,
              },
              {
                ...item,
              },
            ),
          )
        } else {
          updates.push(
            manager.save(
              manager.create(InvStock, {
                ...item,
              }),
            ),
          )
        }
      }
      if (toUpdate.length > 0) {
        for (const item of toUpdate) {
          console.log('item : ', item)
          updates.push(
            manager.update(
              InvDispatchItem,
              {
                id: item.id,
              },
              {
                dispatchId: dispatchId,
                quantity: item.quantity,
                unitValue: item.unitValue,
                totalValue: item.totalValue,
              },
            ),
          )
        }
      }
      if (toDelete.length > 0) {
        updates.push(
          manager.delete(InvDispatchItem, {
            // id: In(toDelete),
            // dispatchId: dispatchId,
            id: In(toDelete.map((el) => el.id)),
            dispatchId: dispatchId,
          }),
        )
      }
      if (toCreate.length > 0) {
        updates.push(
          manager.insert(
            InvDispatchItem,
            toCreate.map(
              (el) =>
                ({
                  ...el,
                }) satisfies Partial<InvDispatchItem>,
            ),
          ),
        )
      }
      await Promise.all(updates)

      await manager.update(
        InvDispatch,
        { id: dispatchId },
        { totalValue: total, netValue: netValue },
      )
    })
  }

  private getModifierHelpers({
    templateFrom,
    templateTo,
    stockFrom,
    stockTo,
    items,
    newItems,
    wareFromId,
    wareToId,
    date,
  }: {
    templateFrom: TemplateItem[]
    templateTo: TemplateItem[]
    stockFrom: InvStock[]
    stockTo: InvStock[]
    items: DispatchItem[]
    newItems: DispatchItem[]
    wareFromId: string
    wareToId: string
    date: string
  }): InvStock[] {
    let modifiedFrom = stockFrom
    let modifiedTo = stockTo
    // primero dejar como estaba antes
    for (const item of items) {
      // from
      const itemTemplate = templateFrom.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplate) {
        const quantity = itemTemplate.getStockQuantity(item.quantity)
        modifiedFrom = modifiedFrom.map((el) => {
          if (el.item_id == itemTemplate.itemStockId) {
            return {
              ...el,
              quantity_out_dp: el.quantity_out_dp - quantity,
              stock_current: el.stock_current + quantity,
            } as InvStock
          }
          return el as InvStock
        })
      }
      // to
      const itemTemplate2 = templateTo.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplate2) {
        const quantity = itemTemplate2.getStockQuantity(item.quantity)
        modifiedTo = modifiedTo.map((el) => {
          if (el.item_id == itemTemplate2.itemStockId) {
            return {
              ...el,
              quantity_in_dp: el.quantity_in_dp - quantity,
              stock_current: el.stock_current - quantity,
            } as InvStock
          }
          return el as InvStock
        })
      }
    }

    // ahora añdir el nuevo
    for (const item of newItems) {
      // from
      const itemTemplate = templateFrom.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplate) {
        const quantity = itemTemplate.getStockQuantity(item.quantity)
        const stock = modifiedFrom.find(
          (el) => el.item_id == itemTemplate.itemStockId,
        )
        if (stock) {
          modifiedFrom = modifiedFrom.map((el) => {
            if (el.item_id == itemTemplate.itemStockId) {
              return {
                ...el,
                quantity_out_dp: el.quantity_out_dp + quantity,
                stock_current: el.stock_current - quantity,
              } as InvStock
            }
            return el as InvStock
          })
        } else {
          const itemDb = itemTemplate.getItemStock()
          modifiedFrom = [
            ...modifiedFrom,
            {
              status: 1,
              item_id: itemDb.id,
              item_name: itemDb.name,
              presentation_id: itemDb.presentationId,
              presentation_name: itemDb.presentationName,
              categoryName: itemDb.categoryName,
              measure_id: itemDb.measureId,
              warehouse_id: wareFromId,
              stock_at: date,
              stock_last: 0,
              quantity_in_dp: 0,
              quantity_in_mv: 0,
              quantity_in_pu: 0,
              quantity_out_mv: 0,
              quantity_out_sl: 0,
              unit_value: itemDb.warehousePrice,
              created_by: 'sys',
              createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              quantity_out_dp: quantity,
              stock_current: quantity * -1,
            } as InvStock,
          ]
        }
      }
      // to
      const itemTemplate2 = templateTo.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemTemplate2) {
        const quantity = itemTemplate2.getStockQuantity(item.quantity)
        const stock = modifiedTo.find(
          (el) => el.item_id == itemTemplate2.itemStockId,
        )
        if (stock) {
          modifiedTo = modifiedTo.map((el) => {
            if (el.item_id == itemTemplate2.itemStockId) {
              return {
                ...el,
                quantity_in_dp: el.quantity_in_dp + quantity,
                stock_current: el.stock_current + quantity,
              } as any as InvStock
            }
            return el as InvStock
          })
        } else {
          const itemDb = itemTemplate2.getItemStock()
          modifiedTo = [
            ...modifiedTo,
            {
              status: 1,
              item_id: itemDb.id,
              item_name: itemDb.name,
              presentation_id: itemDb.presentationId,
              presentation_name: itemDb.presentationName,
              categoryName: itemDb.categoryName,
              measure_id: itemDb.measureId,
              warehouse_id: wareToId,
              stock_at: date,
              stock_last: 0,
              quantity_in_mv: 0,
              quantity_in_pu: 0,
              quantity_out_mv: 0,
              quantity_out_sl: 0,
              created_by: 'sys',
              unit_value: itemDb.storePrice,
              createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              quantity_out_dp: 0,
              quantity_in_dp: quantity,
              stock_current: quantity,
            } as InvStock,
          ]
        }
      }
    }

    return [...modifiedFrom, ...modifiedTo]
  }

  async getListPrice() {
    const items = await this.invItemRepository.find({
      where: {
        relationShip: ItemRelationship.PRINCIPAL,
      },
      order: {
        itemName: 'ASC',
      },
    })

    return items
  }

  async getRelationItem(itemId: number) {
    const item = await this.invItemRepository.findOne({ where: { id: itemId } })
    if (!item) throw new Error('Item no encontrado')
    const items = await this.invItemRepository.find({
      where: {
        productId: item.productId,
        brandId: item.brandId,
        supplierId: item.supplierId,
        relationShip: ItemRelationship.DERIVATE,
      },
    })
    return items
  }

  async updatePrice(
    itemId: number,
    { price, cost }: { price: number; cost: number },
  ) {
    const item = await this.invItemRepository.findOne({ where: { id: itemId } })
    if (!item) throw new Error('Item no encontrado')
    await this.invItemRepository.update(
      { id: itemId },
      { unitPrice: price, unitCost: cost },
    )
  }
}
