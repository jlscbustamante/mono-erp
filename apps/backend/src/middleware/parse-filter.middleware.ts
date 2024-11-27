import { NextFunction, type Request, type Response } from 'express'

export const parseFilters = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (Object.keys(req.body).length > 0) {
      // console.log('pruebna : ', req.body
      next()
    } else {
      const filtersString = req.query as {
        filters: string
      }
      if (!filtersString.filters) {
        req.body = {}
        next()
      } else {
        const parsed = JSON.parse(filtersString.filters)
        req.body = parsed
        next()
      }
    }
  } catch (err: any) {
    // next(Boom.badImplementation(err.message))
    req.body = {}
    next()
  }
}
