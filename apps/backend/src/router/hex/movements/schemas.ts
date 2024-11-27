import Joi from 'joi'

export const infoJobSchema = Joi.object({
  jobName: Joi.string().required(),
})

export const runGroupJobSchema = Joi.object({
  groupName: Joi.string().required(),
})
