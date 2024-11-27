import Joi from 'joi'

export const reconcileRequestSchema = Joi.object({
  requirement_id: Joi.number().integer().required(),
  requirement_description: Joi.string().required().allow(''),
  requirement_amount: Joi.number().required(),
})

export const reconcileParamsSchema = Joi.object({
  transactionkey: Joi.string().required(),
})
