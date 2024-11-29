import type { Request, RequestHandler, Response } from 'express'
import 'reflect-metadata'
import { globalRouter } from './router-app'

export function Get(path: string, ...middlawares: RequestHandler[]) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('path_key', path, target, key)
    Reflect.defineMetadata('method', 'get', target, key)
    Reflect.defineMetadata('middlawares', middlawares, target, key)
  }
}

export function Post(path: string, ...middlawares: RequestHandler[]) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('path_key', path, target, key)
    Reflect.defineMetadata('method', 'post', target, key)
    Reflect.defineMetadata('middlawares', middlawares, target, key)
  }
}

export function Put(path: string, ...middlawares: RequestHandler[]) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('path_key', path, target, key)
    Reflect.defineMetadata('method', 'put', target, key)
    Reflect.defineMetadata('middlawares', middlawares, target, key)
  }
}

export function Delete(path: string, ...middlawares: RequestHandler[]) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('path_key', path, target, key)
    Reflect.defineMetadata('method', 'delete', target, key)
    Reflect.defineMetadata('middlawares', middlawares, target, key)
  }
}

export function createApp(ControllerCLs: any, instance: any) {
  const properties = Object.getOwnPropertyNames(ControllerCLs.prototype)
  properties
    .filter(
      (
        method, // keep the ones that as HTTP method metadata
      ) => Reflect.hasOwnMetadata('method', ControllerCLs.prototype, method),
    )
    .forEach((method) => {
      const path = Reflect.getMetadata(
        'path_key',
        ControllerCLs.prototype,
        method,
      )
      const httpMethod = Reflect.getMetadata(
        'method',
        ControllerCLs.prototype,
        method,
      )
      const middlawares = Reflect.getMetadata(
        'middlawares',
        ControllerCLs.prototype,
        method,
      ) as RequestHandler[]
      // now that we have access to the method name and path at runtime,
      // these could be attached to an express app
      const routeHandler = ControllerCLs.prototype[method]

      // Nos aseguramos de que 'this' dentro del método apunte a la instancia de la clase
      const boundHandler = (
        routeHandler as (req: Request) => Promise<string>
      ).bind(instance)
      if (httpMethod === 'get') {
        globalRouter.get(
          path,
          ...middlawares,
          async (req: Request, res: Response) => {
            const result = await boundHandler(req)
            return res.json({ data: result })
          },
        )
      } else if (httpMethod === 'post') {
        globalRouter.post(
          path,
          ...middlawares,
          async (req: Request, res: Response) => {
            const result = await boundHandler(req)
            return res.json({ data: result })
          },
        )
      } else if (httpMethod === 'put') {
        globalRouter.put(
          path,
          ...middlawares,
          async (req: Request, res: Response) => {
            const result = await boundHandler(req)
            return res.json({ data: result })
          },
        )
      } else if (httpMethod === 'delete') {
        globalRouter.delete(
          path,
          ...middlawares,
          async (req: Request, res: Response) => {
            const result = await boundHandler(req)
            return res.json({ data: result })
          },
        )
      }
    })
}
