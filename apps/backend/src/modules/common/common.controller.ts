import type { Request, Response } from 'express'
import { Sucursal } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { commonService } from './dependencies'

export class CommonController {
  async filterWarehouse(req: Request, res: Response) {
    const filters = req.body as IUserFilter3<Sucursal>
    const data = await commonService.filterSucursal(filters)
    return res.json({
      data,
    })
  }
}
