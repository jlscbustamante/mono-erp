import { unauthorized } from '@hapi/boom'
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config'

const { JWTKey } = config

export const authToken: RequestHandler = (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    const token = authorization?.split(' ')[1]
    if (!token) {
      next(unauthorized('No se envio el token'))
    } else {
      const decode = jwt.verify(token, JWTKey)
      req.user = decode
      next()
    }
  } catch (err: any) {
    next(unauthorized(`Error al validar token: ${err.message} `))
  }
}
