import joi from 'joi'

import { RequestEntity } from '../../../entities/Request'

export const createSchema = joi.object<RequestEntity>({
  request_type: joi.string().required(),
  account_flow: joi.string().allow('', null),
  num_document: joi.string().allow('', null),
  legal_name: joi.string().allow('', null),
  legal_number: joi.string().allow('', null),
  category_move: joi.string().allow(null),
  amount: joi.number().required(),
  amount_net: joi.number().allow(null),
  amount_ret: joi.number().allow(null),
  cash_id: joi.number().required().allow(null),
  cash_account_id: joi.number().allow(null),
  category_id: joi.number().required().allow(null),
  category_account_id: joi.number().allow(null),
  description: joi.string().allow(''),
  cost_center_id: joi.number().allow(null),
  retention: joi.string().valid('0', '1'),
})
