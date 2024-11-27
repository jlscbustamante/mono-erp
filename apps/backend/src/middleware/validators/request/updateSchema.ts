import joi from 'joi'

import { RequestEntity } from '../../../entities/Request'

export const updateSchema = joi.object<RequestEntity>({
  id: joi.number().required(),
  num_document: joi.string().allow('', null),
  legal_name: joi.string().allow('', null),
  legal_number: joi.string().allow('', null),
  purchaseId: joi.number().allow(null),
  doc_url: joi.string().allow('', null),
  account_flow: joi.string().allow('', null),
  category_move: joi.string().allow(null),
  amount: joi.number().required(),
  amount_net: joi.number().allow(null),
  status: joi.string().allow('', null),
  amount_ret: joi.number().allow(null),
  cash_id: joi.number().required().allow(null),
  cash_account_id: joi.number().allow(null),
  category_id: joi.number().required().allow(null),
  category_account_id: joi.number().allow(null),
  description: joi.string().allow(''),
  cost_center_id: joi.number().allow(null),
  retention: joi.string().valid('0', '1'),
  created_by: joi.string().allow('', null),
  updatedAt: joi.string().allow('', null),
  requested_at: joi.any(),
  approved_at: joi.date().iso().allow(null),
  rejected_at: joi.date().iso().allow(null),
  createdAt: joi.any(),
  approved_by: joi.any().allow('', null),
  rejected_by: joi.any().allow('', null),
})
