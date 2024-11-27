import { Application } from 'express'
import Joi from 'joi'

import { IamModuleController } from '../controllers/iamModule.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamModuleController = new IamModuleController()
export const loadIamModuleEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-module/get',
    validateToken,

    iamModuleController.getIamModule,
  )
  app.get(
    '/api/security/iam-module/filter',
    validateToken,

    iamModuleController.getFilteredIamModuleNt,
  )
  app.post(
    '/api/security/iam-module/create-IamModule',
    validateToken,

    iamModuleController.createIamModule,
  )
  app.get(
    '/api/security/iam-module/get-IamModule-one',
    validateToken,

    validateSchema(
      Joi.object({
        IamModuleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamModuleController.getIamModuleOne,
  )
  app.put(
    '/api/security/iam-module/update-IamModule',
    validateToken,

    validateSchema(
      Joi.object({
        IamModuleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamModuleController.updateIamModule,
  )
}
