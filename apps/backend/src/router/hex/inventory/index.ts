import { Application } from 'express'
import Joi from 'joi'

import { validateToken } from '../../../middleware/jwt/validateToken'
import validateSchema from '../../../middleware/validators/validateSchema'
import { HexInventoryController } from './controller'
import { HexInventoryReportController } from './report.controller'
import {
  approveDispatchSchema,
  approveMovementSchema,
  createDispatchSchema,
  createDriverSchema,
  createInitialStockSchema,
  generateGuideWithTransportSchema,
  getEditTemplateSchema,
  getOneDispatchSchema,
  invoiceAndGuideDispatchSchema,
  invoiceDispatchSchema,
  lastClosedDateSchema,
  modifyDispatchedSchema,
  ReportStockOneDateSchema,
  ReportStockSchema,
  saveStockSchema,
  simpleDispatchSchema,
  stockByRangeSchema,
  templateDispatchSchema,
  updateDispatchSchema,
  updateDriverSchema,
  updateSucursulasSchema,
  warehouseLegalSchema,
} from './schemas'

const controller = new HexInventoryController()
const reportController = new HexInventoryReportController()
export const loadHexInventoryEndpoints = (app: Application): void => {
  app.post(
    '/api/hex/inventory/createInitialStock',
    validateSchema(createInitialStockSchema),
    controller.createInitialStock,
  )

  app.get('/api/hex/inventory/defaultWarehouse', controller.defaultWarehouse)

  app.get(
    '/api/hex/inventory/templateDispatch',
    validateSchema(templateDispatchSchema, 'query'),
    controller.templateDispatch,
  )

  app.get(
    '/api/hex/inventory/stockByRange',
    validateSchema(stockByRangeSchema, 'query'),
    controller.stockByRange,
  )

  app.get(
    '/api/hex/inventory/lastClosedDate',
    validateSchema(lastClosedDateSchema, 'query'),
    controller.lastClosedDate,
  )

  app.post(
    '/api/hex/inventory/approveDispatch',
    validateToken,
    validateSchema(approveDispatchSchema),
    controller.approveDispatch,
  )

  app.post(
    '/api/hex/inventory/approveDispatchWV',
    validateToken,
    validateSchema(approveDispatchSchema),
    controller.approveDispatchWithoutValidation,
  )

  app.post(
    '/api/hex/inventory/approveMovement',
    validateToken,
    validateSchema(approveMovementSchema),
    controller.approveMovement,
  )

  app.post(
    '/api/hex/inventory/createDispatchAndApprove',
    validateToken,
    validateSchema(createDispatchSchema),
    controller.createDispatchAndApprove,
  )

  app.post(
    '/api/hex/inventory/createDispatchException',
    validateToken,
    validateSchema(createDispatchSchema),
    controller.createDispatchException,
  )

  app.post(
    '/api/hex/inventory/storePurchase',
    validateToken,
    validateSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
    ),
    controller.storePurchase,
  )
  app.post(
    '/api/hex/inventory/revertStorePurchase',
    validateToken,
    validateSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
    ),
    controller.revertStorePurchase,
  )

  app.get('/api/hex/inventory/warehouses', controller.getWarehouses)

  app.get('/api/hex/inventory/stockRangeAny', controller.stockRangeAnyWarehouse)

  app.get(
    '/api/hex/inventory/lastClosedWarehouse',
    controller.lastClosedWarehouse,
  )

  app.get(
    '/api/hex/inventory/editTemplate',
    validateSchema(getEditTemplateSchema, 'query'),
    controller.getEditTemplate,
  )

  app.post(
    '/api/hex/inventory/saveStock',
    validateSchema(saveStockSchema),
    controller.saveStock,
  )

  app.get('/api/hex/inventory/info/warehouses', controller.infoWarehouses)

  app.get(
    '/api/hex/inventory/report/stock',
    validateSchema(ReportStockSchema, 'query'),
    reportController.inventoryReport,
  )

  app.get(
    '/api/hex/inventory/report/stock/one',
    validateSchema(ReportStockOneDateSchema, 'query'),
    reportController.inventoryReportOneDate,
  )

  app.get('/api/hex/inventory/checkTemplates', controller.checkTemplates)

  app.get(
    '/api/hex/inventory/dispatches',
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
      }),
      'query',
    ),
    controller.getDispatches,
  )

  app.get(
    '/api/hex/inventory/dispatch/:id',
    validateSchema(getOneDispatchSchema, 'params'),
    controller.getDispatch,
  )

  app.post(
    '/api/hex/inventory/dispatch/invoiceAndGuide',
    validateToken,
    validateSchema(invoiceAndGuideDispatchSchema),
    controller.invoiceAndGenerateGuide,
  )

  app.post(
    '/api/hex/inventory/dispatch/invoice',
    validateToken,
    validateSchema(invoiceDispatchSchema),
    controller.invoiceDispatch,
  )

  app.post(
    '/api/hex/inventory/dispatch/guide',
    validateToken,
    validateSchema(invoiceDispatchSchema),
    controller.generateGuide,
  )

  app.post(
    '/api/hex/inventory/dispatch/guideWithTransport',
    validateToken,
    validateSchema(generateGuideWithTransportSchema),
    controller.generateGuideWithTransport,
  )

  app.post(
    '/api/hex/inventory/dispatch/invoice/test-get-body',
    validateSchema(invoiceDispatchSchema),
    controller.testGetBodyInvoice,
  )

  app.post(
    '/api/hex/inventory/dispatch/guide/test-get-body',
    validateSchema(invoiceDispatchSchema),
    controller.testGetBodyGuide,
  )

  app.post(
    '/api/hex/inventory/dispatch/guide-with-transport/test-get-body',
    validateSchema(generateGuideWithTransportSchema),
    controller.testGetBodyGuideWithTransport,
  )

  app.put(
    '/api/hex/inventory/dispatch/update',
    validateSchema(updateDispatchSchema),
    controller.updateDispatch,
  )

  app.get('/api/hex/inventory/items', controller.getItems)

  app.get('/api/hex/inventory/items/get', controller.getItemsFormatted)

  app.put(
    '/api/hex/inventory/dispatch/updateDispatched',
    validateToken,
    validateSchema(modifyDispatchedSchema),
    controller.modifyDispatched,
  )

  app.get('/api/hex/inventory/drivers', controller.getDrivers)

  app.post(
    '/api/hex/inventory/dispatch/simple-dispatch',
    validateToken,
    validateSchema(simpleDispatchSchema),
    controller.simpleDispatch,
  )

  app.get('/api/hex/inventory/warehouseLegal', controller.getWarehousesLegal)

  app.post(
    '/api/hex/inventory/warehouseLegal',
    validateToken,
    validateSchema(warehouseLegalSchema),
    controller.createWarehouse,
  )

  app.put(
    '/api/hex/inventory/warehouseLegal',
    validateToken,
    validateSchema(warehouseLegalSchema),
    controller.updateWarehouse,
  )

  app.get('/api/hex/inventory/driver', controller.drivers)
  app.get('/api/hex/inventory/driver/filter', controller.filterDrivers)

  app.post(
    '/api/hex/inventory/driver',
    validateToken,
    validateSchema(createDriverSchema),
    controller.createDriver,
  )

  app.put(
    '/api/hex/inventory/driver',
    validateToken,
    validateSchema(updateDriverSchema),
    controller.updateDriver,
  )

  app.delete('/api/hex/inventory/driver/:id', controller.deleteDriver)

  app.get('/api/hex/inventory/warehouse/route', controller.getWarehouseRoutes)

  app.put(
    '/api/hex/inventory/warehouse/route',
    controller.updateWarehouseRoutes,
  )

  app.get(
    '/api/hex/inventory/dispatchByRoute',
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
        route: Joi.string().required(),
      }),
      'query',
    ),
    controller.getDispatchByRoute,
  )

  app.get(
    '/api/hex/inventory/disapatchConsolidation',
    validateSchema(
      Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
      }),
      'query',
    ),
    controller.getDispatchConsolidation,
  )

  app.post(
    '/api/hex/inventory/dispatch/zipedFiles',
    validateToken,
    validateSchema(
      Joi.object({
        files: Joi.array()
          .items(
            Joi.object({
              doc_url: Joi.string().required(),
              doc_operacion: Joi.string().required(),
              warehouseId: Joi.string().required(),
            }),
          )
          .max(160),
      }),
    ),
    controller.zipedFiles,
  )

  app.post(
    '/api/hex/inventory/divideDispatch',
    validateSchema(
      Joi.object({
        dispatchId: Joi.number().required(),
        relation: Joi.array()
          .required()
          .items(
            Joi.object({
              dispatchItemId: Joi.number().required(),
              warehouseId: Joi.string().required(),
            }),
          ),
      }),
    ),
    controller.divideDispatch,
  )

  app.put(
    '/api/hex/pos/sucursal-update',
    validateSchema(updateSucursulasSchema),
    controller.sucursalUpdate,
  )

  app.get(
    '/api/hex/dispatch/consolidate-item',
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
        itemId: Joi.number().required(),
      }),
      'query',
    ),
    controller.getConsolidateByItem,
  )
  app.put(
    '/api/hex/dispatch/reset',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
    ),
    controller.resetDispatch,
  )
  app.put(
    '/api/hex/dispatch/movement/resetAndDelete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
    ),
    controller.resetAndDeleteMovement,
  )
  app.put(
    '/api/hex/dispatch/reset-and-delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
    ),
    controller.resetAndDeleteDispatch,
  )

  app.get(
    '/api/hex/inventory/items-pricipales',
    // validateToken,
    controller.getListPrice,
  )

  app.get(
    '/api/hex/inventory/items-relations',
    validateSchema(
      Joi.object({
        itemId: Joi.number().required(),
      }),
      'query',
    ),
    // validateToken,
    controller.getRelationItem,
  )

  app.put(
    '/api/hex/inventory/item/price',
    validateSchema(
      Joi.object({
        itemId: Joi.number().required(),
        price: Joi.number().required(),
        cost: Joi.number().required(),
      }),
    ),
    controller.updatePrice,
  )
}
