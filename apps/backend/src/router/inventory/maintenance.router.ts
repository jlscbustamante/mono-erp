import { Application } from 'express'
import Joi from 'joi'

import validateSchema from '../../middleware/validators/validateSchema'
import { MaintenanceController } from './maintenance.controller'

const controller = new MaintenanceController()
export const loadInventoryMaintenanceEndpoints = (app: Application) => {
  app.get('/api/lt/inventory/brand/list', controller.listBrand)

  app.post('/api/lt/inventory/brand/create', controller.createBrand)

  app.put('/api/lt/inventory/brand/update', controller.updateBrand)

  app.delete(
    '/api/lt/inventory/brand/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'body',
    ),
    controller.deleteBrand,
  )

  app.get('/api/lt/inventory/presentation/list', controller.listPresentation)

  app.post(
    '/api/lt/inventory/presentation/create',
    controller.createPresentation,
  )

  app.put(
    '/api/lt/inventory/presentation/update',
    controller.updatePresentation,
  )

  app.delete(
    '/api/lt/inventory/presentation/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'body',
    ),
    controller.deletePresentation,
  )

  app.get('/api/lt/inventory/measure/list', controller.listMeasure)

  app.post('/api/lt/inventory/measure/create', controller.createMeasure)

  app.put('/api/lt/inventory/measure/update', controller.updateMeasure)

  app.delete(
    '/api/lt/inventory/measure/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
    ),
    controller.deleteMeasure,
  )

  app.get('/api/lt/inventory/eq/list', controller.listEquivalences)

  app.post('/api/lt/inventory/eq/create', controller.createEquivalence)

  app.put('/api/lt/inventory/eq/update', controller.updateEquivalence)

  app.delete(
    '/api/lt/inventory/eq/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'body',
    ),
    controller.deleteEquivalence,
  )

  app.get('/api/lt/inventory/category/list', controller.listCategories)

  app.post('/api/lt/inventory/category/create', controller.createCategory)

  app.put('/api/lt/inventory/category/update', controller.updateCategory)

  app.delete(
    '/api/lt/inventory/category/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'body',
    ),
    controller.deleteCategory,
  )

  app.get('/api/lt/inventory/templatesBase/list', controller.listTemplateBase)

  app.get(
    '/api/lt/inventory/template/itemList',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'query',
    ),
    controller.listItemsTemplate,
  )

  app.put(
    '/api/lt/inventory/template/item/update',
    controller.updateItemTemplate,
  )

  app.post(
    '/api/lt/inventory/template/item/create',
    controller.createItemTemplate,
  )

  app.delete(
    '/api/lt/inventory/template/item/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
      'body',
    ),
    controller.deleteItemTemplate,
  )

  app.get(
    '/api/lt/inventory/template/itemsDispatch',
    controller.getListTemplateDispatch,
  )

  app.get('/api/inventory/getItemsInventario', controller.getItemsInventario)

  app.get(
    '/api/inventory/getItemsInventarioAll',
    controller.getItemsInventarioAll,
  )
}
