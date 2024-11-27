import { Application } from 'express'
import Joi from 'joi'

import { DispatchController } from '../../controllers/inventory/dispatch.controller'
import { ProductController } from '../../controllers/inventory/product.controller'
import { PurchaseController } from '../../controllers/inventory/purchase.controller'
import { validateToken } from '../../middleware/jwt/validateToken'
import validateSchema, {
  validatePartialSchema,
} from '../../middleware/validators/validateSchema'
import { ITransportista } from '../../types'

const productController = new ProductController()
const purchaseController = new PurchaseController()
const dispatchController = new DispatchController()

export const loadProductEndpoints = (app: Application): void => {
  app.post('/api/inventory/product/filter', productController.getProducts)

  app.post('/api/inventory/product', productController.createProduct)

  app.delete(
    '/api/inventory/product/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
      'body',
    ),
    productController.deleteProduct,
  )

  app.delete(
    '/api/inventory/product-item/delete',
    validateSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
      'body',
    ),
    productController.deleteItem,
  )
  app.get('/api/inventory/product/getOne/:id', productController.getOneProduct)
  app.put('/api/inventory/product/edit', productController.editProduct)
  app.put('/api/inventory/product-item/edit', productController.editProductItem)

  app.get('/api/inventory/measures', productController.measures)
  app.get('/api/inventory/categories', productController.categories)

  app.post('/api/inventory/products/filter', productController.getProducts)

  app.post('/api/inventory/measure', productController.createMeasure)
  app.post('/api/inventory/category/create', productController.createCategory)

  app.post('/api/inventory/brand/create', productController.createBrand)

  app.post(
    '/api/inventory/presentation/create',
    productController.createPresentation,
  )

  app.get('/api/inventory/presentation/get', productController.getPresentations)
  app.get('/api/inventory/brand/get', productController.getBrands)
  app.get('/api/inventory/supplier/get', productController.getSuppliers)

  app.post(
    '/api/inventory/product-item/create',
    productController.createProductItem,
  )
  app.get(
    '/api/inventory/product-item/getOne/:id',
    productController.getOneProductItem,
  )
  app.post(
    '/api/inventory/product-item/filter',
    productController.filterProductItems,
  )

  app.post('/api/inventory/supplier/create', productController.createSupplier)

  app.put('/api/inventory/supplier/edit', productController.updateSupplier)

  app.delete(
    '/api/inventory/supplier/delete',
    validateSchema(Joi.object({ id: Joi.number().required() }), 'body'),
    productController.deleteSupplier,
  )

  app.delete(
    '/api/inventory/purchase/delete',
    validateToken,
    productController.deletePurchase,
  )

  app.post('/api/inventory/purchase/filter', purchaseController.getPurchases)

  app.post(
    '/api/inventory/purchase/create',
    validateToken,
    purchaseController.createPurchase,
  )

  app.post(
    '/api/inventory/purchase/create-req-from-purchase',
    purchaseController.createRequirementFromPurchase,
  )

  app.post(
    '/api/inventory/warehouse/create',
    dispatchController.createWarehouse,
  )

  app.get('/api/inventory/sucursalList', dispatchController.getSucursalList)

  app.post(
    '/api/inventory/warehouse/filter',
    dispatchController.filterWarehouses,
  )

  app.post('/api/inventory/warehouse/get', dispatchController.getWarehouse)

  app.post(
    '/api/inventory/dispatch/create',
    // validateToken,
    dispatchController.createDispatch,
  )
  app.post(
    '/api/inventory/dispatch/createBetweenStores',
    validateToken,
    dispatchController.createDispatchBetween,
  )

  app.get(
    '/api/inventory/dispatch/getToday',
    validateSchema(Joi.object({ date: Joi.date().iso().required() }), 'query'),
    dispatchController.getDispatchToday,
  )

  app.post(
    '/api/inventory/dispatch/createOne',
    validateToken,
    dispatchController.createDispatchAll,
  )

  app.put(
    '/api/inventory/dispatch/update',
    validateToken,
    validatePartialSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
      'body',
    ),
    dispatchController.updateDispatch,
  )

  app.put(
    '/api/inventory/dispatch/updateAndApprove',
    validateToken,
    validatePartialSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
      'body',
    ),
    dispatchController.updateDispatchAndApprove,
  )

  app.put(
    '/api/inventory/dispatch/reject',
    validateToken,
    validatePartialSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
    ),
    dispatchController.rejectDispatch,
  )

  app.put(
    '/api/inventory/dispatch/updateState',
    validateToken,
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
        status: Joi.string().required(),
      }),
      'body',
    ),
    dispatchController.updateDispatchStatus,
  )

  app.put(
    '/api/inventory/pos/dispatch/update',
    (req, res, next) => {
      console.log('log s : ', req.body)
      next()
    },
    // validateExtToken,
    // validatePartialSchema(
    //   Joi.object({
    //     id: Joi.number().integer().required(),
    //   }),
    //   'body',
    // ),
    dispatchController.updateDispatch,
  )

  app.post(
    '/api/inventory/dispatch/get',
    validateToken,
    dispatchController.getDispatch,
  )

  app.post(
    '/api/inventory/dispatch/filter',
    // validateToken,
    dispatchController.filterDispatch,
  )

  app.get(
    '/api/inventory/dispatch/base',
    validateSchema(Joi.object({ type: Joi.string().required() }), 'query'),
    dispatchController.getDispatchBase,
  )

  app.get(
    '/api/inventory/dispatch/getBySucursal',
    validateSchema(
      Joi.object({
        sucursalCode: Joi.string().required(),
        start: Joi.date().iso(),
        end: Joi.date().iso(),
      }),
      'query',
    ),
    dispatchController.getBySucursal,
  )

  app.post(
    '/api/inventory/dispatch/approve/:id',
    validateSchema(Joi.object({ id: Joi.number().required() }), 'params'),
    dispatchController.approveDispatch,
  )

  app.post(
    '/api/inventory/dispatch/saveTransportistaAndApprove/:id',
    validateSchema(
      Joi.object<ITransportista>({
        conductor_apellidos: Joi.string(),
        conductor_nombres: Joi.string(),
        conductor_nro_doc: Joi.string(),
        conductor_nro_licencia: Joi.string(),
        conductor_tipo: Joi.string(),
        conductor_tipo_doc: Joi.string(),
        transporte_nro_doc: Joi.string(),
        transporte_nro_placa: Joi.string(),
        transporte_razon_social: Joi.string(),
        transporte_tipo_doc: Joi.string(),
      }),
      'body',
    ),
    validateSchema(
      Joi.object({
        id: Joi.number().integer().required(),
      }),
      'params',
    ),
    dispatchController.saveApproveAndTransportista,
  )

  app.get(
    '/api/inventory/dispatch/getOrGenrateGuideDoc/:id',
    dispatchController.getOrGenrateGuideDoc,
  )

  app.get(
    '/api/inventory/dispatch/pdfIsAvailable',
    validateSchema(Joi.object({ url: Joi.string().required() }), 'query'),
    dispatchController.pdfIsAvailable,
  )

  app.get(
    '/api/inventory/dispatch/getById',
    validateSchema(Joi.object({ id: Joi.number().required() }), 'query'),
    dispatchController.getDispatchById,
  )

  app.post(
    '/api/inventory/dispatch/createDispatchFromTemplate',
    validateToken,
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
        sucursalId: Joi.string().required(),
        sucursalNombre: Joi.string().required(),
      }),
      'body',
    ),
    dispatchController.createDispatchFromTemplate,
  )
}
