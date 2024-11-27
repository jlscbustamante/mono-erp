import { Application } from 'express'
import Joi from 'joi'

import { SupplierController } from '../controllers/supplier.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const supplierController = new SupplierController()
export const loadSupplierEndpoints = (app: Application): void => {
  app.put(
    '/api/suppliers/update-supplier',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        supplierId: Joi.number().integer().required(),
      }),
      'query',
    ),
    supplierController.updateSupplier,
  )

  app.get(
    '/api/suppliers/get-supplier',
    validateToken,
    supplierController.getSupplier,
  )
  app.post(
    '/api/suppliers/create-supplier',
    validateToken,
    supplierController.createSupplier,
  )
  app.get(
    '/api/suppliers/get-supplier-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        supplierId: Joi.number().integer().required(),
      }),
      'query',
    ),
    supplierController.getSupplierOne,
  )
  app.get(
    '/api/supplier/filter',
    validateToken,
    validatePermission,
    supplierController.getFilterSupplier,
  )
}
