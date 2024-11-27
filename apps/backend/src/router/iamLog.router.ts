import { Application } from 'express'
import Joi from 'joi'

import { IamLogController } from '../controllers/iamLog.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamLogController = new IamLogController()
export const loadIamLogEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-log/get',
    validateToken,
    validatePermission,
    iamLogController.getIamLog,
  )
  app.get(
    '/api/security/iam-log/filter',
    validateToken,
    validatePermission,
    iamLogController.getFilteredIamLogNt,
  )
  app.post(
    '/api/security/iam-log/create-iamLog',
    validateToken,
    validatePermission,
    iamLogController.createIamLog,
  )
  app.get(
    '/api/security/iam-log/get-iamLog-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamLogId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamLogController.getIamLogOne,
  )
  app.put(
    '/api/security/iam-log/update-iamLog',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamLogId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamLogController.updateIamLog,
  )
}
