import Joi from 'joi'

export const closeCashAccountSchema = Joi.object({
  cashAccountIds: Joi.array().items(Joi.number().integer()).min(1).required(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('store', 'request').required(),
  replace: Joi.boolean(),
  force: Joi.boolean(),
})

export const accountEntriesRequestSchema = Joi.object({
  date: Joi.array().items(Joi.date().iso().required()).min(2).max(2),
  replace: Joi.boolean(),
  force: Joi.boolean(),
})

export const balanceReportSchema = Joi.object({
  date: Joi.date().iso().required(),
  cashAccountId: Joi.number().integer().required(),
})
export const initialBalanceStoreSchema = Joi.object({
  date: Joi.date().iso().required(),
  cashAccountId: Joi.number().integer().required(),
})
export const detailedReportRequestSchema = Joi.object({
  date: Joi.date().iso().required(),
  cashAccountId: Joi.number().integer().required(),
})
