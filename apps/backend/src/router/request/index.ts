import { Application } from 'express'
import Joi from 'joi'

import { CashAccountController } from '../../controllers/cashAccount.controller'
import { RequestController } from '../../controllers/request.controller'
import { validateToken } from '../../middleware/jwt/validateToken'
import { validatePermission } from '../../middleware/validatePermission/validatePermission'
import {
  closeCashAccountSchema,
  detailedReportRequestSchema,
} from '../../middleware/validators/cashAccount'
import { createSchema } from '../../middleware/validators/request/createSchema'
import { updateSchema } from '../../middleware/validators/request/updateSchema'
import validateSchema from '../../middleware/validators/validateSchema'

const requestController = new RequestController()
const cashAccountController = new CashAccountController()
export const loadRequestEndpoints = (app: Application) => {
  app.post(
    '/api/requests/filter-movil',
    validateToken,
    requestController.filter,
  )

  app.post(
    '/api/requests/filter',
    validateToken,
    validatePermission,
    requestController.filter,
  )
  app.post(
    '/api/requests/filter-count',
    validateToken,
    requestController.filterCount,
  )

  app.post(
    '/api/requests/create',
    validateToken,
    validatePermission,
    validateSchema(createSchema),
    requestController.createRequest,
  )

  app.put(
    '/api/requests/update',
    validateToken,
    validatePermission,
    validateSchema(updateSchema),
    requestController.updateRequest,
  )

  app.put(
    '/api/requests/remove-approval/:id',
    validateToken,
    validatePermission,
    requestController.removeApproval,
  )

  app.put(
    '/api/requests/approve/:id',
    validateToken,
    validatePermission,
    requestController.approveRequest,
  )
  app.put(
    '/api/requests/reject/:id',
    validateToken,
    validatePermission,
    requestController.rejectRequest,
  )

  app.get(
    '/api/requests/get-name-by-ruc/:ruc',
    validateToken,
    requestController.getNameByRuc,
  )

  app.get(
    '/api/requests/get-categories',
    validateToken,
    requestController.getCategories,
  )

  app.get(
    '/api/requests/get-cost-centers',
    validateToken,
    requestController.getCostCenters,
  )

  app.get(
    '/api/requests/get-cash-accounts',
    validateToken,
    requestController.getCashAccounts,
  )

  app.get(
    '/api/requests/detailed-report',
    validateToken,
    validateSchema(detailedReportRequestSchema, 'query'),
    validatePermission,
    cashAccountController.getDetailedReportRequest,
  )

  app.get(
    '/api/requests/balance-report',
    validateToken,
    validatePermission,
    cashAccountController.getBalanceReportRequest,
  )

  app.get(
    '/api/requests/summary-report',
    validateToken,
    validateSchema(Joi.object({ date: Joi.date().iso().required() }), 'query'),
    validatePermission,
    cashAccountController.getReportRequest,
  )

  app.post(
    '/api/requests/close-cash-accounts',
    validateToken,
    validateSchema(closeCashAccountSchema, 'body'),
    validatePermission,
    cashAccountController.closeCashAccounts,
  )

  app.get(
    '/api/requests/report/cost-center',
    validateToken,
    validateSchema(
      Joi.object({
        start: Joi.date().iso().required(),
        end: Joi.date().iso().required(),
      }),
      'query',
    ),
    requestController.reportCostCenter,
  )
}
