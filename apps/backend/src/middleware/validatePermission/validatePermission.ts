/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'

// const { JWTKey } = config

export const validatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    next()
    // const apiUrlPrefix = '/api/'
    // const currentUrl =
    //   (`${req.path}`.split(apiUrlPrefix)[1] || req.path).replace(
    //     /\/[^/]*$/,
    //     '/?',
    //   ) || req.originalUrl
    // const currentUrls = `${req.path}`.split(apiUrlPrefix)[1] || req.originalUrl
    // const _token = req.headers.authorization
    // console.log(currentUrls)
    // console.log(currentUrl)
    // if (!_token) {
    //   next(Boom.unauthorized('No se envió el token'))
    // } else {
    //   const token = _token.split(' ')[1]
    //   if (!JWTKey) {
    //     next(Boom.internal('El TOKEN NO FUE AÑADIDO AL .ENV'))
    //   }

    //   const decode: any = jwt.verify(token, JWTKey)
    //   if (config.disabledPermissions) {
    //     next()
    //   } else if (decode) {
    //     const rolId = decode.rol_id
    //     const status = decode.status
    //     const permissionSingleton = PermissionSingleton.getInstance()
    //     if (permissionSingleton.rol != String(rolId)) {
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       await permissionSingleton.fetchPermissionsFromDatabase(rolId)
    //     }
    //     if (
    //       (permissionSingleton.hasPermission(currentUrl) ||
    //         permissionSingleton.hasPermission(currentUrls)) &&
    //       status
    //     ) {
    //       next()
    //     } else {
    //       next(Boom.unauthorized('Acceso no autorizado'))
    //     }
    //   } else {
    //     next(Boom.internal('Error al decodificar el token'))
    //   }
    // }
  } catch (error: any) {
    next(Boom.unauthorized(`Error al validar token: ${error.message}`))
  }
}
