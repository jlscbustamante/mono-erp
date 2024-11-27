import { Application } from 'express'
import Joi from 'joi'

import { IamFunctionController } from '../controllers/iamFunction.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamFunctionController = new IamFunctionController()
export const loadiamFunctionEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-function/get',
    validateToken,

    iamFunctionController.getIamFunction,
  )
  app.get(
    '/api/security/iam-function/filter',
    validateToken,

    iamFunctionController.getFilteredIamFunctionNt,
  )
  app.post(
    '/api/security/iam-function/create-iamFunction',
    validateToken,

    iamFunctionController.createIamFunction,
  )
  app.get(
    '/api/security/iam-function/get-iamFunction-one',
    validateToken,

    validateSchema(
      Joi.object({
        iamFunctionId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamFunctionController.getIamFunctionOne,
  )
  app.put(
    '/api/security/iam-function/update-iamFunction',
    validateToken,

    validateSchema(
      Joi.object({
        iamFunctionId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamFunctionController.updateIamFunction,
  )
}
