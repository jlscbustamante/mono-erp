import { Application } from 'express'
import Joi from 'joi'

import { IamUserController } from '../controllers/iamUser.controller'
import validateSchema from '../middleware/validators/validateSchema'

const authController = new IamUserController()

export const loadAuthEndpoints = (app: Application): void => {
  app.post('/api/user/login', authController.login)

  app.post(
    '/api/user/sign/app',
    validateSchema(
      Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    ),
    authController.signApp,
  )
}
