import Joi from 'joi'

export const loginWithPhoneSchema = Joi.object({
  phone: Joi.string().required(),
  code: Joi.string(),
})

export const validateLoginSchema = Joi.object({
  token: Joi.string().required(),
  otp: Joi.string().required(),
})
