import Boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import config from '../../config/config'

const { JWTKey, JWTExternalKey } = config

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const _token = req.headers.authorization
    if (!_token) next(Boom.unauthorized('No se envio el token'))
    else {
      const token = _token.split(' ')[1]
      // eslint-disable-next-line no-console
      if (!JWTKey) console.log('EL TOKEN NO FUE AÑADIDO AL .ENV')
      const decode = jwt.verify(token, JWTKey)
      req.headers.token = decode as string
      next()
    }
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    next(Boom.unauthorized(`Error al validar token: ${error.message} `))
  }
}

export const validateExtToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const _token = req.headers.authorization
    if (!_token) next(Boom.unauthorized('No se envio el token'))
    else {
      const token = _token.split(' ')[1]
      // eslint-disable-next-line no-console
      if (!JWTExternalKey) console.log('EL TOKEN NO FUE AÑADIDO AL .ENV')
      const decode = jwt.verify(token, JWTExternalKey)
      req.headers.token = decode as string
      next()
    }
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    next(Boom.unauthorized(`Error al validar token: ${error.message} `))
  }
}
