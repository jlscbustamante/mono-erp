import { Application } from 'express'
import Joi from 'joi'

import { validateToken } from '../../middleware/jwt/validateToken'
import validateSchema, {
  validatePartialSchema,
} from '../../middleware/validators/validateSchema'
import { ExternalController } from './external.controller'
import { RatioController } from './ratio.controller'
import {
  getNewTemplateSchema,
  getNewWarehouseTemplateSchema,
  idStockSchema,
  saveNewStockSchema,
} from './schemas'

const controller = new ExternalController()
const ratioController = new RatioController()
export const loadExternalEndpoints = (app: Application) => {
  app.post('/api/ext/createStock', controller.createStock)

  app.delete(
    '/api/ext/deleteStock',
    validateSchema(idStockSchema),
    controller.deleteStock,
  )

  app.get(
    '/api/ext/getStock/id/:id',
    validateSchema(idStockSchema, 'params'),
    controller.getStock,
  )

  app.get(
    '/api/ext/getStock/sucursal/:code',
    // validateSchema(idStockSchema, 'params'),
    validateSchema(
      Joi.object({
        code: Joi.string().required(),
      }),
      'params',
    ),
    // validateSchema(stockAtSchema, 'query'),
    controller.getStockBySucursal,
  )

  app.get(
    '/api/ext/stock/isEmpty',
    validateSchema(
      Joi.object({
        code: Joi.string().required(),
      }),
      'query',
    ),
    controller.stockIsEmpty,
  )

  app.put(
    '/api/ext/updateStock',
    validatePartialSchema(idStockSchema),
    controller.updateStock,
  )

  app.get(
    '/api/ext/reporteMercaderia',
    validateSchema(
      Joi.object({
        store_code: Joi.string().required(),
        date: Joi.date().iso().required(),
      }),
      'query',
    ),
    controller.getReportInventory,
  )

  app.get('/api/ext/stock/template', controller.getTemplateStock)
  app.get('/api/ext/dispatch/template', controller.getTemplateDispatch)

  app.get(
    '/api/ext/stock/store/newStock',
    validateSchema(getNewTemplateSchema, 'query'),
    controller.getTemplateNewStock,
  )

  app.get(
    '/api/ext/stock/warehouse/newStock',
    validateSchema(getNewWarehouseTemplateSchema, 'query'),
    controller.getTemplateNewStockAlmacen,
  )

  app.get(
    '/api/ext/warehouse/lastStock',
    validateSchema(
      Joi.object({
        sucursalCode: Joi.string().required(),
      }),
      'query',
    ),
    controller.getWarehouseLastStock,
  )

  app.post(
    '/api/ext/stock/store/saveStock',
    validateSchema(saveNewStockSchema),
    controller.saveNewStock,
  )

  app.put('/api/ext/stock/store/update', controller.updateStockStore)

  app.post(
    '/api/ext/dispatch/approve',
    validateToken,
    controller.approveDispatch,
  )

  app.post(
    '/api/ext/dispatch/approveBetweenStores',
    validateToken,
    controller.approveDispatchBettwen,
  )

  app.get(
    '/api/ext/stock/store/getStock',
    validateSchema(
      Joi.object({
        sucursalCode: Joi.string().required(),
        date: Joi.date().iso().required(),
        type: Joi.string().required(),
      }),
      'query',
    ),
    controller.getStockStore,
  )

  app.get(
    '/api/ext/stock/store/getAnyStatusStock',
    validateSchema(
      Joi.object({
        sucursalCode: Joi.string().required(),
        date: Joi.date().iso().required(),
        type: Joi.string().required(),
      }),
      'query',
    ),
    controller.getAnyStockStore,
  )

  app.get(
    '/api/ext/stock/store/getStockWarehouse',
    validateSchema(
      Joi.object({
        sucursalCode: Joi.string().required(),
        date: Joi.date().iso().required(),
        type: Joi.string().required(),
      }),
      'query',
    ),
    controller.getStockWarehouse,
  )

  app.post(
    '/api/ext/stock/store/ratioGlobal',
    validateSchema(
      Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
        stores: Joi.array().items(Joi.string()).required(),
      }),
    ),
    ratioController.getRatioByStores,
  )

  app.post(
    '/api/ext/adm/sucursal_sales',
    validateSchema(
      Joi.object({
        store_id: Joi.string(),
        sales_at: Joi.date().iso().required(),
        sales_cash: Joi.number().required(),
        sales_pm: Joi.number().required(),
        sales_others: Joi.number().required(),
        sales_total: Joi.number().required(),
        created_by: Joi.string().required(),
      }),
    ),
    controller.createSucursalSale,
  )

  app.get(
    '/api/ext/rptVentaTienda',
    validateSchema(
      Joi.object({
        stores: Joi.array().items(Joi.string()),
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
        group: Joi.number().integer(),
        company: Joi.string(),
      }),
      'query',
    ),
    ratioController.getRptVentaTienda,
  )

  app.get('/api/ext/sipro/items', controller.getItemsStockSipro)

  app.get('/api/ext/sipro/despachos', controller.getDispatchSipro)

  app.get('/api/ext/sipro/despachos/:id', controller.getOneDispatchSipro)

  app.get('/api/ext/sipro/clientes', controller.getClientsSipro)
}
