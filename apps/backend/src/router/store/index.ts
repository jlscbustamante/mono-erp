import { Application } from 'express'
import Joi from 'joi'

import { CashAccountController } from '../../controllers/cashAccount.controller'
import { CashMoveController } from '../../controllers/cashMove.controller'
import { PosController } from '../../controllers/pos/pos.controller'
import { StoreController } from '../../controllers/store.controller'
import { validateToken } from '../../middleware/jwt/validateToken'
import { validatePermission } from '../../middleware/validatePermission/validatePermission'
import {
  closeCashAccountSchema,
  initialBalanceStoreSchema,
} from '../../middleware/validators/cashAccount'
import { createMovesSchema } from '../../middleware/validators/cashMove/createMovesSchema'
import { createSchema } from '../../middleware/validators/cashMove/createSchema'
import { updateSchema } from '../../middleware/validators/cashMove/updateSchema'
import validateSchema from '../../middleware/validators/validateSchema'
import { createMovesPosSchema } from './createMovesSchema'

const cashMoveController = new CashMoveController()
const posController = new PosController()
const storeController = new StoreController()
const cashAccountController = new CashAccountController()

export const loadStoreEndpoints = (app: Application): void => {
  app.get(
    '/api/store/cash-moves/filter',
    validateToken,
    validatePermission,
    cashMoveController.filterCashMoves,
  )

  app.post(
    '/api/store/cash-moves/movement/create',
    validateToken,
    validateSchema(createSchema),
    validatePermission,
    cashMoveController.createMovement,
  )

  app.post(
    '/api/store/cash-moves/movements',
    validateToken,
    validateSchema(createMovesSchema),
    cashMoveController.createMovements,
  )

  app.put(
    '/api/store/cash-moves/movement/update',
    validateToken,
    validateSchema(updateSchema),
    validatePermission,
    cashMoveController.updateMovement,
  )

  app.delete(
    '/api/store/cash-moves/movement/:id',
    validateToken,
    validatePermission,
    cashMoveController.deleteMovement,
  )

  app.put(
    '/api/store/cash-moves/movement/sign/:id',
    validateToken,
    validatePermission,
    cashMoveController.signMovement,
  )

  app.put(
    '/api/store/cash-moves/movement/unsign/:id',
    validateToken,
    validatePermission,
    cashMoveController.unsignMovement,
  )

  app.get(
    '/api/store/cash-moves/compare-balances',
    validateToken,
    validatePermission,
    cashMoveController.compareBalancesEfis,
  )

  app.get(
    '/api/store/reconcile-payment-methods',
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
        exclude: Joi.array().items(Joi.string()),
      }),
      'query',
    ),
    validatePermission,
    storeController.getInfoPaymentMethods,
  )

  app.put(
    '/api/store/reconcile-payment-methods/sign',
    validateToken,
    validateSchema(
      Joi.object({
        date: Joi.date().iso().required(),
        cashId: Joi.number().integer().required(),
        sucursalCode: Joi.string().required(),
        culqiAmount: Joi.number(),
        izipayAmount: Joi.number(),
        onlineAmount: Joi.number(),
      }),
    ),
    validatePermission,
    storeController.signReconciliation,
  )

  app.get(
    '/api/store/transaction-by-method',
    validateSchema(
      Joi.object({
        sucursalcode: Joi.string().required(),
        date: Joi.date().iso().required(),
        method: Joi.string().valid('izipay', 'culqi', 'online').required(),
        exclude: Joi.array().items(Joi.string()),
      }),
      'query',
    ),
    storeController.getTransactionsByMethod,
  )

  app.get(
    '/api/store/amount-by-pos',
    validateToken,
    validateSchema(
      Joi.object({
        sucursalcode: Joi.string().required(),
        date: Joi.date().iso().required(),
        exclude: Joi.array().items(Joi.string()),
      }),
      'query',
    ),
    storeController.getAmountByPos,
  )

  app.get('/api/store/get-categories', storeController.getCategories)

  app.get(
    '/api/store/get-categories-store',
    storeController.getCategoriesByStore,
  )

  app.get(
    '/api/store/get-cash-accounts',
    validateToken,
    storeController.getCashAccounts,
  )

  app.post(
    '/api/store/close-cash-accounts',
    validateToken,
    validateSchema(closeCashAccountSchema, 'body'),
    validatePermission,
    cashAccountController.closeCashAccounts,
  )

  app.get(
    '/api/store/balance-report',
    validateToken,
    cashAccountController.getBalanceReportRequest,
  )

  app.get(
    '/api/store/all-states-payment',
    // validateToken,
    cashAccountController.getAllStatesPayment,
  )

  app.get(
    '/api/store/initial-balance-store',
    validateToken,
    validateSchema(initialBalanceStoreSchema, 'query'),
    cashAccountController.getInitialBalanceStore,
  )

  app.get(
    '/api/store/cash-move/getone/:id',
    validateToken,
    cashMoveController.getOne,
  )

  app.post(
    '/api/store/load-from-efisis',
    validateToken,
    validateSchema(Joi.object({ date: Joi.date().iso().required() }), 'body'),
    cashMoveController.loadFromEfisis,
  )

  app.post(
    '/api/store/pos/createMoves',
    validateSchema(createMovesPosSchema),
    posController.createMoves,
  )

  app.post(
    '/api/store/pos/resetData',
    validateToken,
    validateSchema(
      Joi.object({
        cashId: Joi.number().integer().required(),
        date: Joi.date().iso().required(),
      }),
    ),
    posController.resetStoreData,
  )

  app.put(
    '/api/pos/store/update-store',
    validateToken,
    validateSchema(
      Joi.object({
        storeCode: Joi.string().required(),
      }),
    ),
    posController.updateInfoStore,
  )
}
