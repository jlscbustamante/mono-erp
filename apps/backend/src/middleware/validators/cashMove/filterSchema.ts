import joi from 'joi'

import { Operator } from '../../../types'

export const filterSchema = joi.object({
  field: joi.array().items(joi.string()).min(1).required(),
  value: joi.array().items(joi.string()).min(1).required(),
  operator: joi
    .array()
    .items(joi.string().valid(...Object.values(Operator)))
    .min(1)
    .required(),
})
