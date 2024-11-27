import { Application } from 'express'
import Joi from 'joi'

import { IamPermissionController } from '../controllers/iamPermission.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamPermissionController = new IamPermissionController()
export const loadIamPermissionEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-permission/get',
    validateToken,

    iamPermissionController.getIamPermission,
  )
  app.get(
    '/api/security/iam-permission/filter',
    validateToken,

    iamPermissionController.getFilteredIamPermissionNt,
  )
  app.post(
    '/api/security/iam-permission/create-iamPermission',
    validateToken,

    iamPermissionController.createIamPermission,
  )
  app.get(
    '/api/security/iam-permission/get-iamPermission-one',
    validateToken,

    validateSchema(
      Joi.object({
        iamPermissionId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamPermissionController.getIamPermissionOne,
  )
  app.put(
    '/api/security/iam-permission/update-iamPermission',
    validateToken,

    validateSchema(
      Joi.object({
        iamPermissionId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamPermissionController.updateIamPermission,
  )
  app.delete(
    '/api/security/iam-permission/delete-iamRoles',
    validateToken,

    validateSchema(
      Joi.object({
        rol_id: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamPermissionController.deleteIamPermission,
  )
}
