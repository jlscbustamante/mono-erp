import { Application } from 'express'
import Joi from 'joi'

import { MenuReportController } from '../controllers/menuReport.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'
import { iamLogger } from '../middleware/iamlog-middleware'

const menuReportController = new MenuReportController()

export const loadMenuReportEndpoints = (app: Application): void => {
  app.put(
    '/api/menu-report/update-menu-report',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        menuReportId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamLogger,
    menuReportController.updateMenuReport,
  )
  app.get(
    '/api/menu-report/get-menu-report',
    validateToken,
    validatePermission,
    menuReportController.getMenuReport,
  )
  app.get(
    '/api/menu-report/get-menu-report-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        menuReportId: Joi.number().integer().required(),
      }),
      'query',
    ),
    menuReportController.getMenuReportOne,
  )
  app.post(
    '/api/menu-report/create-menu-report',
    validateToken,
    validatePermission,
    iamLogger,
    menuReportController.createMenuReport,
  )
  app.get(
    '/api/menu-report/filter',
    validateToken,
    validatePermission,
    menuReportController.getFilterMenuReport,
  )
}
