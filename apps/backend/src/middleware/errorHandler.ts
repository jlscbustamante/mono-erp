/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import Boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'

import config from '../config/config'
import { safeAny } from '../utils/someAny'

const invalidRoute = (req: Request, _: Response, next: NextFunction): void => {
  next(Boom.notFound(`ruta no valida : ${req.url}`))
}

const logErrors = (
  err: safeAny,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('Log errors : =======')
  console.log(new Date().toString())
  console.log(err)
  console.log('====================')

  next(err)
}

const errorHandler = (
  err: safeAny,
  req: Request,
  res: Response,
  _: NextFunction,
): void => {
  res.status(500).json({
    message: err.message,
    stack: config.dev ? err.stack : undefined,
  })
}

const boomErrorHandler = (
  err: safeAny,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err.isBoom) {
    const { output } = err
    res.status(output.statusCode).json(output.payload)
  } else {
    next(err)
  }
}

export { boomErrorHandler, errorHandler, invalidRoute, logErrors }
