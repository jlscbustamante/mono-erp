import { Application } from 'express'
import Joi from 'joi'

import { SucursalController } from '../controllers/sucursal.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const sucursalController = new SucursalController()

export const loadSucursalEndpoints = (app: Application): void => {
  app.put(
    '/api/sucursal/update-sucursal',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        sucursalId: Joi.string().required(),
      }),
      'query',
    ),
    sucursalController.updateSucursal,
  )
  app.get(
    '/api/sucursal/list-sucursal',
    validateToken,
    sucursalController.getSucursal,
  )
  app.get(
    '/api/sucursal/update-sucursal-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        sucursalId: Joi.string().required(),
      }),
      'query',
    ),
    sucursalController.updateSucursalOne,
  )
  app.post(
    '/api/sucursal/create-sucursal',
    validateToken,
    validatePermission,
    sucursalController.createSucursal,
  )
  app.get(
    '/api/sucursal/filter',
    validateToken,
    validatePermission,
    sucursalController.getFilterSucursal,
  )
}
