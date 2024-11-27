import { Application } from 'express'
import Joi from 'joi'

import { CashAccountController } from '../controllers/cashAccount.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const cashAccountController = new CashAccountController()

export const loadCashAccountEndpoints = (app: Application): void => {
  app.put(
    '/api/cash-account/update-cash-account',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        cashAccountId: Joi.number().integer().required(),
      }),
      'query',
    ),
    cashAccountController.updateCashAccount,
  )

  app.put(
    '/api/cash-account/update-type-cash',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        cashTypeId: Joi.number().integer().required(),
      }),
      'query',
    ),
    cashAccountController.updateTypeChash,
  )

  app.get(
    '/api/cash-account/get-cash-account-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        cashAccountId: Joi.number().integer().required(),
      }),
      'query',
    ),
    cashAccountController.getCashAccountOne,
  )

  app.get(
    '/api/cash-account/get-typecash-account-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        cashTypeAccountId: Joi.number().integer().required(),
      }),
      'query',
    ),
    cashAccountController.getTypeCashAccountOne,
  )

  app.get(
    '/api/cash-account/get-cash-account',
    validateToken,

    cashAccountController.getCashAccount,
  )

  app.get(
    '/api/cash-account/get-typecash-account',
    validateToken,

    cashAccountController.getTypeCashAccount,
  )

  app.post(
    '/api/cash-account/create-cash-account',
    validateToken,
    validatePermission,
    cashAccountController.createCashAccount,
  )

  app.post(
    '/api/cash-account/create-typecash-account',
    validateToken,
    validatePermission,
    cashAccountController.createTypeCashAccount,
  )
  app.post(
    '/api/cash-account/filter',
    validateToken,
    validatePermission,
    cashAccountController.getFilteredNt,
  )

  app.get(
    '/api/cash-account/filters',
    validateToken,
    validateSchema(
      Joi.object({
        nameCash: Joi.string().required(),
      }),
      'query',
    ),
    cashAccountController.getFilteredNts,
  )

  app.get(
    '/api/cash-account-type/filter',
    validateToken,
    validatePermission,
    cashAccountController.getFilteredTypeNt,
  )
  app.post(
    '/api/cash-account/balance',
    validateToken,
    validateSchema(
      Joi.object({
        accountId: Joi.number().integer().required(),
        date: Joi.date().required(),
        monto: Joi.number().required(),
        name: Joi.string().required(),
      }),
      'query',
    ),
    cashAccountController.createCashBalance,
  )
}
