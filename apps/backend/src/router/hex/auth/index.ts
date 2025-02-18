import { Application } from 'express'

import validateSchema from '../../../middleware/validators/validateSchema'
import { AuthController } from './controller'
import { loginWithPhoneSchema, validateLoginSchema } from './schemas'

const controller = new AuthController()
export const authEndpoints = (app: Application): void => {
  app.post(
    '/api/hex/auth/loginPhone',
    validateSchema(loginWithPhoneSchema),
    controller.loginPhone,
  )

  app.post(
    '/api/hex/auth/loginWsp',
    validateSchema(loginWithPhoneSchema),
    controller.loginWsp,
  )

  app.post(
    '/api/hex/auth/validateLoginPhone',
    validateSchema(validateLoginSchema),
    controller.validateOtp,
  )
}
