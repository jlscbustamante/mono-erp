import Joi from 'joi'

import {
  CreateDriverDto,
  DispatchCreateDto,
  DispatchItemAddDto,
  DispatchItemCreateDto,
  MoveBetweenStoresDto,
  MoveItemDto,
  UpdateDriverDto,
  UpdateSucursalDto,
} from '../../../core/inventory/dto'
import { CreateInitialStockDto } from '../../../core/inventory/dto/create_initial_stock.dto'
import { Stock } from '../../../core/inventory/entities'
import {
  Dispatch,
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchItem,
} from '../../../core/inventory/entities/dispatch'
import { WarehouseLegal } from '../../../core/inventory/entities/warehouse'

export const ReportStockSchema = Joi.object({
  start: Joi.date().iso().required(),
  end: Joi.date().iso().required(),
  sucursalCode: Joi.string().required(),
})

export const ReportStockOneDateSchema = Joi.object({
  date: Joi.date().iso().required(),
  sucursalCode: Joi.string().required(),
})

export const stockByRangeSchema = Joi.object({
  warehouse: Joi.string().required(),
  start: Joi.string().required(),
  end: Joi.string().required(),
  company: Joi.string().allow(''),
})

export const templateDispatchSchema = Joi.object({
  sucursalCode: Joi.string().required(),
  company: Joi.string(),
})

export const lastClosedDateSchema = Joi.object({
  warehouse: Joi.string().required(),
})

export const approveDispatchSchema = Joi.object<Dispatch>({
  id: Joi.number().integer().required(),
  wareToId: Joi.string().required(),
  wareFromId: Joi.string().required(),
  dispatchAt: Joi.date().iso().required(),
  wareFromName: Joi.string().allow(''),
  wareToName: Joi.string().allow(''),
  numInvoice: Joi.string().allow(''),
  numGuide: Joi.string().required().allow(''),
  taxValue: Joi.number().required(),
  gloss: Joi.string().allow('').required(),
  moveType: Joi.string()
    .valid(...Object.values(DISPATCH_MOVE_TYPE))
    .required(),
  netValue: Joi.number().required(),
  totalValue: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(DISPATCH_STATUS))
    .required(),
  requestBy: Joi.string().allow('').required(),
  approvedBy: Joi.string().allow('').allow(null).required(),
  items: Joi.array()
    .items(
      Joi.object<DispatchItem>({
        id: Joi.number().integer(),
        dispatchId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().integer().required(),
        measureId: Joi.number().integer().required(),
        measureCode: Joi.string(),
        quantity: Joi.number().required(),
        unitValue: Joi.number().required(),
        totalValue: Joi.number().required(),
        presentationName: Joi.string().required(),
      }),
    )
    .required(),
})

export const updateDispatchSchema = Joi.object<Dispatch>({
  id: Joi.number().integer().required(),
  wareToId: Joi.string().required(),
  wareFromId: Joi.string().allow(''),
  wareFromName: Joi.string().allow(''),
  wareToName: Joi.string().allow(''),
  dispatchAt: Joi.date().iso().required(),
  numInvoice: Joi.string().allow(''),
  numGuide: Joi.string().required().allow(''),
  taxValue: Joi.number().required(),
  gloss: Joi.string().allow('').required(),
  moveType: Joi.string()
    .valid(...Object.values(DISPATCH_MOVE_TYPE))
    .required(),
  netValue: Joi.number().required(),
  totalValue: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(DISPATCH_STATUS))
    .required(),
  requestBy: Joi.string().allow('').required(),
  approvedBy: Joi.string().allow('').allow(null),
  items: Joi.array()
    .items(
      Joi.object<DispatchItem>({
        id: Joi.number().integer(),
        dispatchId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().integer().required(),
        measureId: Joi.number().integer().required(),
        measureCode: Joi.string(),
        quantity: Joi.number().required(),
        unitValue: Joi.number().required(),
        totalValue: Joi.number().required(),
        presentationName: Joi.string().required(),
      }),
    )
    .required(),
})

export const saveStockSchema = Joi.object({
  date: Joi.date().iso().required(),
  warehouse: Joi.string().required(),
  stock: Joi.array()
    .items(
      Joi.object<Stock>({
        id: Joi.number().integer().allow(null),
        totalInitial: Joi.number().allow(null),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        categoryName: Joi.string().required().allow(''),
        presentationId: Joi.number().integer().required(),
        presentationName: Joi.string().required(),
        measureId: Joi.number().integer().required(),
        warehouseId: Joi.string().required(),
        stockAt: Joi.date().iso().required(),
        initialStock: Joi.number().required(),
        stockCurrent: Joi.number().required(),
        stockPhysical: Joi.number().required(),
        unitValue: Joi.number().required(),
        totalValue: Joi.number().required(),
        createdBy: Joi.string().allow(''),
        status: Joi.string()
          .valid(
            ...[
              DISPATCH_STATUS.APPROVED,
              DISPATCH_STATUS.CANCELLED,
              DISPATCH_STATUS.NEW,
              DISPATCH_STATUS.DISPATCHED,
            ],
          )
          .required(),
        quantityInMv: Joi.number().required(),
        quantityInPurchase: Joi.number().required(),
        quantityInDispatch: Joi.number().required(),
        quantityOutMv: Joi.number().required(),
        quantityOutDispatch: Joi.number().required(),
        quantityOutSale: Joi.number().required(),
      }),
    )
    .required(),
})

export const getEditTemplateSchema = Joi.object({
  date: Joi.date().iso().required(),
  warehouse: Joi.string().required(),
  company: Joi.string().allow(''),
})

export const approveMovementSchema = Joi.object<MoveBetweenStoresDto>({
  storeFrom: Joi.string(),
  storeToId: Joi.string(),
  moveAt: Joi.date().iso().required(),
  gloss: Joi.string().allow('').required(),
  items: Joi.array()
    .items(
      Joi.object<MoveItemDto>({
        itemId: Joi.number().integer().required(),
        quantity: Joi.number().required(),
      }),
    )
    .required(),
})

export const createDispatchSchema = Joi.object<DispatchCreateDto>({
  gloss: Joi.string().allow('').required(),
  approvedBy: Joi.string().allow(''),
  dispatchAt: Joi.date().iso().required(),
  items: Joi.array()
    .items(
      Joi.object<DispatchItemCreateDto>({
        itemId: Joi.number().integer().required(),
        dispatchId: Joi.number().integer(),
        itemName: Joi.string().required(),
        measureId: Joi.number().integer().required(),
        presentationId: Joi.number().integer().required(),
        presentationName: Joi.string().required(),
        quantity: Joi.number().required(),
        totalValue: Joi.number().required(),
        unitValue: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
  moveType: Joi.string(),
  netValue: Joi.number().required(),
  numGuide: Joi.string().allow('').required(),
  numInvoice: Joi.string().allow(''),
  requestBy: Joi.string().allow(''),
  status: Joi.number(),
  taxValue: Joi.number().required(),
  totalValue: Joi.number().required(),
  wareFromId: Joi.string().allow(null, ''),
  wareToId: Joi.string().allow(null, ''),
})

export const createInitialStockSchema = Joi.object<CreateInitialStockDto>({
  stockAt: Joi.date().iso().required(),
  storeCode: Joi.string().required(),
  company: Joi.string().allow(''),
  items: Joi.array().items(
    Joi.object({
      itemId: Joi.number().integer().required(),
      initialStock: Joi.number().required(),
    }),
  ),
})

export const getOneDispatchSchema = Joi.object({
  id: Joi.number().integer().required(),
})

export const invoiceDispatchSchema = Joi.object({
  dispatchId: Joi.number().integer().required(),
})

export const generateGuideWithTransportSchema = Joi.object({
  dispatchId: Joi.number().integer().allow('').required(),
  transportCompanyName: Joi.string().allow('').required(),
  licensePlateNumber: Joi.string().allow('').required(),
  driverDocumentType: Joi.string().allow('').required(),
  driverDocumentNumber: Joi.string().allow('').required(),
  driverFirstName: Joi.string().allow('').required(),
  driverLastName: Joi.string().allow('').required(),
  driverLicenseNumber: Joi.string().allow('').required(),
})

export const simpleDispatchSchema = Joi.object({
  dispatchId: Joi.number().integer().required(),
  wareFromId: Joi.string(),
  dispatchDate: Joi.date().iso().required(),
})

export const invoiceAndGuideDispatchSchema = Joi.object({
  dispatchId: Joi.number().integer().required(),
  transport: Joi.object({
    transportCompanyName: Joi.string().allow('').required(),
    licensePlateNumber: Joi.string().allow('').required(),
    driverDocumentType: Joi.string().allow('').required(),
    driverDocumentNumber: Joi.string().allow('').required(),
    driverFirstName: Joi.string().allow('').required(),
    driverLastName: Joi.string().allow('').required(),
    driverLicenseNumber: Joi.string().allow('').required(),
  }).allow(null),
})

export const warehouseLegalSchema = Joi.object<WarehouseLegal>({
  code: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  legalName: Joi.string().allow(''),
  correlativo: Joi.string().allow(''),
  district: Joi.string().allow(''),
  guideCorrelativo: Joi.string().allow(''),
  guideSerie: Joi.string().allow(''),
  legalAddress: Joi.string().allow(''),
  legalNumber: Joi.string().allow(''),
  serie: Joi.string().allow(''),
})

export const createDriverSchema = Joi.object<CreateDriverDto>({
  transportName: Joi.string().required(),
  transportCompanyName: Joi.string().required(),
  transportPlateNumber: Joi.string().required(),
  driverTypeDoc: Joi.string().required(),
  driverDocNumber: Joi.string().required(),
  driverFirstName: Joi.string().required(),
  driverLastName: Joi.string().required(),
  driverLicenseNumber: Joi.string().required(),
  status: Joi.string().required(),
  carrierDocNumber: Joi.string().allow(''),
})

export const updateDriverSchema = Joi.object<UpdateDriverDto>({
  id: Joi.number().integer().required(),
  transportName: Joi.string(),
  transportCompanyName: Joi.string(),
  transportPlateNumber: Joi.string(),
  driverTypeDoc: Joi.string(),
  driverDocNumber: Joi.string(),
  driverFirstName: Joi.string(),
  driverLastName: Joi.string(),
  driverLicenseNumber: Joi.string(),
  status: Joi.string().required(),
})

export const modifyDispatchedSchema = Joi.object({
  dispatchId: Joi.number().integer().required(),
  toCreate: Joi.array()
    .items(
      Joi.object<DispatchItemAddDto>({
        dispatchId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().integer().required(),
        presentationName: Joi.string().required(),
        quantity: Joi.number().required(),
        totalValue: Joi.number().required(),
        unitValue: Joi.number().required(),
        measureId: Joi.number().integer().required(),
      }),
    )
    .min(0),
  toUpdate: Joi.array()
    .items(
      Joi.object<DispatchItem>({
        id: Joi.number().integer().required(),
        dispatchId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().integer().required(),
        presentationName: Joi.string().required(),
        measureId: Joi.number().integer().required(),
        measureCode: Joi.string().required(),
        quantity: Joi.number().required(),
        unitValue: Joi.number().required(),
        totalValue: Joi.number().required(),
      }),
    )
    .min(0),
  toDelete: Joi.array()
    .items(
      Joi.object<DispatchItem>({
        id: Joi.number().integer().required(),
        dispatchId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().integer().required(),
        presentationName: Joi.string().required(),
        measureId: Joi.number().integer().required(),
        measureCode: Joi.string().required(),
        quantity: Joi.number().required(),
        unitValue: Joi.number().required(),
        totalValue: Joi.number().required(),
      }),
    )
    .min(0),
  taxValue: Joi.number().required(),
})

export const updateSucursulasSchema = Joi.object({
  stores: Joi.array()
    .items(
      Joi.object<UpdateSucursalDto>({
        id: Joi.string().required(),
        trademark_id: Joi.string().required(),
        title: Joi.string().required(),
        ubi_address: Joi.string().required(),
        ubi_district: Joi.string().required(),
        ubi_city: Joi.string().allow(''),
        sede_nro_ruc: Joi.string().required(),
        sede_razon_social: Joi.string().required(),
        efact_pass: Joi.string().required(),
        cfd_serie_fa: Joi.string(),
        cfd_igv: Joi.string(),
        cfd_seql_fa: Joi.number(),
        cfd_serie_bo: Joi.string(),
        cfd_seql_bo: Joi.number(),
        status: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
})
