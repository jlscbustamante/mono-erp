import joi from 'joi'

import { CashMove } from '../../../entities/CashMove'
import { CashMoveFlow } from '../../../types/cashMove'

export const createMovesSchema = joi.object({
  moves: joi
    .array()
    .items(
      joi.object<CashMove>({
        description: joi.string().allow(''),
        amount: joi.number().required(),
        cash_id: joi.number().required(),
        account_flow: joi
          .string()
          .valid(...Object.values(CashMoveFlow))
          .required()
          .allow(null),
        cash_account_id: joi.number().required(),
        category_expense_id: joi.number().required().allow(null),
        category_account_id: joi.number().required().allow(null),
        requested_at: joi.date().iso().required(),
      }),
    )
    .min(1)
    .required(),
})
