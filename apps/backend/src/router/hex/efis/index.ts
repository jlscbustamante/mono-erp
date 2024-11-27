import { Application } from 'express'
import Joi from 'joi'

import validateSchema from '../../../middleware/validators/validateSchema'
import { EfisController } from './controller'

const controller = new EfisController()
export const loadPointstHexEfis = (app: Application) => {
  app.get(
    '/api/hex/efis/send_dispatch',
    validateSchema(
      Joi.object({
        dispatchId: Joi.number().required(),
      }),
      'query',
    ),
    controller.sendDispatch,
  )
}
