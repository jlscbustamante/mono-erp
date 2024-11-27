import joi from 'joi'

import { CashMove } from '../../../entities/CashMove'
import { CashMoveFlow } from '../../../types/cashMove'

export const updateSchema = joi.object<CashMove>({
  id: joi.number().integer().required(),
  description: joi.string().allow(''),
  amount: joi.number(),
  cash_id: joi.number(),
  account_flow: joi.string().valid(...Object.values(CashMoveFlow)),
  cash_account_id: joi.number(),
  category_expense_id: joi.number(),
  category_account_id: joi.number(),
  requested_at: joi.date().iso(),
})
