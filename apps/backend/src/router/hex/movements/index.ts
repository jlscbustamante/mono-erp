import { Application } from 'express'

import { validateToken } from '../../../middleware/jwt/validateToken'
import validateSchema from '../../../middleware/validators/validateSchema'
import { MovementController } from './controller'
import { infoJobSchema } from './schemas'

const controller = new MovementController()
export const movementEndpoints = (app: Application) => {
  app.get(
    '/api/hex/movements/job/info',
    validateSchema(infoJobSchema, 'query'),
    controller.getInfoJob,
  )

  app.get('/api/hex/movements/job/all', controller.listJobs)

  app.post(
    '/api/hex/movements/job/run',
    validateToken,
    controller.startGroupJob,
  )

  app.get(
    '/api/hex/movements/job/run/status',
    validateToken,
    controller.getStatusRun,
  )

  app.get('/api/hex/movements/job/getGroups', controller.getGroupsJob)

  app.get('/api/hex/movements/job/available', controller.getAvailableJobs)

  app.get('/api/hex/movements/job/clear', controller.clearJobs)
}
