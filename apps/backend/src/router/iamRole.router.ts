import { Application } from 'express'
import Joi from 'joi'

import { IamRoleController } from '../controllers/iamRole.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamRoleController = new IamRoleController()
export const loadiamRoleEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-role/get',
    validateToken,

    iamRoleController.getIamRole,
  )
  app.get(
    '/api/security/iam-role/filter',
    validateToken,
    validatePermission,
    iamRoleController.getFilteredIamRoleNt,
  )
  app.post(
    '/api/security/iam-role/create-iamRole',
    validateToken,
    validatePermission,
    iamRoleController.createIamRole,
  )
  app.get(
    '/api/security/iam-role/get-iamRole-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamRoleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamRoleController.getIamRoleOne,
  )
  app.put(
    '/api/security/iam-role/update-iamrole',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamRoleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamRoleController.updateIamRole,
  )
  app.put(
    '/api/security/iam-role/updateStatus-iamrole',
    validateToken,

    validateSchema(
      Joi.object({
        iamRoleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamRoleController.updateIamRoleStatus,
  )
  app.get(
    '/api/security/iam-role/groupFunctions',
    validateToken,

    validateSchema(
      Joi.object({
        moduleId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamRoleController.groupFunctions,
  )
}
