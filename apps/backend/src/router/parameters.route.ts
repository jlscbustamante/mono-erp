import { Application } from 'express'
import Joi from 'joi'

import { ParametersController } from '../controllers/parameters.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const parametersController = new ParametersController()

export const loadParametersEndpoints = (app: Application): void => {
  app.put(
    '/api/parameters/update-parameter',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        parameterId: Joi.number().integer().required(),
      }),
      'query',
    ),
    parametersController.updateParameters,
  )

  app.get(
    '/api/parameters/get-parameter',
    validateToken,
    validatePermission,
    parametersController.getParameters,
  )
  app.get(
    '/api/parameters/get-parameter-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        parameterId: Joi.number().integer().required(),
      }),
      'query',
    ),
    parametersController.getParametersOne,
  )
  app.post(
    '/api/parameters/create-parameter',
    validateToken,
    validatePermission,
    parametersController.createParameters,
  )
  app.get(
    '/api/parameters/filter',
    validateToken,
    validatePermission,

    parametersController.getFilterParameters,
  )
}
