import Boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'
import joi from 'joi'

import { safeAny } from '../../utils/someAny'

const validateSchema = (
  schema: joi.ObjectSchema<safeAny>,
  check: 'body' | 'query' | 'params' = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[check as keyof Request])
    error
      ? next(
          Boom.badRequest(
            error.details[0].message || 'Error, revisa la informacion enviada',
          ),
        )
      : next()
  }
}

export const validatePartialSchema = <T>(
  schema: joi.ObjectSchema<any>,
  check = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const obj: T = {} as T
    const properties = Object.keys(schema.describe().keys)
    properties.forEach((property) => {
      if (req[check as keyof Request][property as keyof T]) {
        obj[property as keyof T] = req[check as keyof Request][property]
      }
    })
    const { error } = schema.validate(obj)
    error
      ? next(
          Boom.badRequest(
            error.details[0].message || 'error, review the information sent',
          ),
        )
      : next()
  }
}
export default validateSchema
