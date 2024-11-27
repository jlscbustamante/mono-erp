import { Application } from 'express'
import Joi from 'joi'

import { PowerBiController } from '../controllers/powerBi.controller'
import { ReportDBController } from '../controllers/reports/reportDb.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const reportsController = new PowerBiController()
const reportsDbController = new ReportDBController()

export const loadReportsEndpoints = (app: Application): void => {
  app.get('/api/reports', validateToken, reportsController.getReports)

  app.post(
    '/api/reports/account-moves',
    validateToken,
    validateSchema(
      Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
        accountIds: Joi.array(),
        costCenterIds: Joi.array(),
      }),
      'body',
    ),
    reportsDbController.getAccountMoves,
  )

  app.get(
    '/api/reports/estado-resultados',
    validateToken,
    validateSchema(Joi.object({ date: Joi.date().iso() }), 'query'),
    reportsDbController.estadosResultados,
  )

  app.get(
    '/api/reports/get-token/:reportId',
    validateToken,
    reportsController.getEmbeddedToken,
  )

  app.get(
    '/api/reports/get-info',
    validateToken,
    reportsController.getInfoAccount,
  )
  app.post(
    '/api/reports/create',
    validateToken,
    validateSchema(
      Joi.object({
        workspaceId: Joi.string().required(),
        reportId: Joi.string().required(),
        name: Joi.string().required(),
      }),
    ),
    reportsController.createReport,
  )
}
