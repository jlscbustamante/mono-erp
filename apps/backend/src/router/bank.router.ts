import { Application } from 'express'

import { BankController } from '../controllers/bank.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import {
  reconcileParamsSchema,
  reconcileRequestSchema,
} from '../middleware/validators/bank'
import validateSchema from '../middleware/validators/validateSchema'

const bankController = new BankController()
export const loadBankEndpoints = (app: Application): void => {
  app.get(
    '/api/bank/filter',
    validateToken,
    validatePermission,
    bankController.filter,
  )

  app.get(
    '/api/bank/first-pending-reconciliation',
    validateToken,
    validatePermission,
    bankController.getFirstReconciliation,
  )

  app.put(
    '/api/bank/reconcile/:transactionkey',
    validateToken,
    validatePermission,
    validateSchema(reconcileRequestSchema),
    validateSchema(reconcileParamsSchema, 'params'),
    bankController.reconcileTransactionToRequest,
  )
}
