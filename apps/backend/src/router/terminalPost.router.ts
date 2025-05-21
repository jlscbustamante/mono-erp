import { Application } from 'express'
import Joi from 'joi'

import { TerminalPostController } from '../controllers/terminalPost.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import { iamLogger } from '../middleware/iamlog-middleware'
import validateSchema from '../middleware/validators/validateSchema'

const terminalPostController = new TerminalPostController()

export const loadTerminalPostEndpoints = (app: Application): void => {
  app.put(
    '/api/terminal-post/update-terminal-post',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        terminalPostId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamLogger,
    terminalPostController.updateTerminalPost,
  )
  app.get(
    '/api/terminal-post/get-terminal-post',
    validateToken,
    validatePermission,

    terminalPostController.getTerminalPost,
  )
  app.post(
    '/api/terminal-post/create-terminal-post',
    validateToken,
    validatePermission,
    iamLogger,
    terminalPostController.createTerminalPost,
  )
  app.get(
    '/api/terminalPost/filter',
    validateToken,
    validatePermission,
    terminalPostController.getFilterTerminalPost,
  )
}
