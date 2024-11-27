/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction } from 'express'

import { safeAny } from '../someAny'

export function catchError(
  target: safeAny,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): safeAny {
  const originalMethod = descriptor.value

  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await originalMethod.call(this, req, res)
    } catch (error) {
      next(error)
    }
  }

  return descriptor
}
