import { Request, Response } from 'express'
import { Carrier } from 'pizzadb'
import { IUserFilter3 } from '../../types/filter'
import { catchError } from '../../utils/decorators'
import { driverService } from './dependencies'

export class DriverController {
  @catchError
  async filterDriver(req: Request, res: Response) {
    const filters = req.body as IUserFilter3<Carrier>
    const data = await driverService.filterDriver(filters)
    return res.json({
      data,
    })
  }
}
