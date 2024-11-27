import { Application } from 'express'
import Joi from 'joi'

import { IamUserController } from '../controllers/iamUser.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const iamUserController = new IamUserController()
export const loadIamUserEndpoints = (app: Application): void => {
  app.get(
    '/api/security/iam-user/get',
    validateToken,
    validatePermission,
    iamUserController.getIamUser,
  )
  app.get(
    '/api/security/iam-User/filter',
    validateToken,
    validatePermission,
    iamUserController.getFilteredIamUserNt,
  )
  app.post(
    '/api/security/iam-User/create-iamUser',

    iamUserController.createIamUser,
  )
  app.get(
    '/api/security/iam-User/get-iamUser-one',
    validateToken,

    validateSchema(
      Joi.object({
        iamUserId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamUserController.getIamUserOne,
  )
  /////////////////////////////////////////////////////////////////////////////////////

  app.get(
    '/api/security/iam-User/validateEmail',
    validateSchema(
      Joi.object({
        email: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.validateEmail,
  )

  app.get(
    '/api/security/iam-User/resetPassword',
    validateSchema(
      Joi.object({
        email: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.resetPassword,
  )

  app.get(
    '/api/security/iam-User/validateInfo',
    validateSchema(
      Joi.object({
        token: Joi.string().required(),
        code: Joi.number().integer().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.validateInfo,
  )

  app.put(
    '/api/security/iam-User/update-ConfirmPassword',
    validateSchema(
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.updateConfirmPassword,
  )

  app.get(
    '/api/security/iam-User/firstLogin',
    validateSchema(
      Joi.object({
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.firstLogin,
  )

  /////////////////////////////////////////////////////////////////////////////////////
  app.put(
    '/api/security/iam-User/update-iamUser',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamUserId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamUserController.updateIamUser,
  )
  app.post('/api/user/login', iamUserController.login)

  app.put(
    '/api/security/iam-User/reset-password',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        iamUserId: Joi.number().integer().required(),
        password: Joi.string().required(),
      }),
      'query',
    ),
    iamUserController.resetPasswordForm,
  )
}
