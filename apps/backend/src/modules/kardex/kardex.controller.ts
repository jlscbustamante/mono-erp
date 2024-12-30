import { Request } from 'express'
import { Fillime, InvKardex } from 'pizzadb'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import { Get } from '../../utils/decorators/endpoint.middleware'
import { KardexService } from './kardex.service'

export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get('/kardex')
  async kardex() {
    return this.kardexService.kardex()
  }

  @Get('/kardex/filter', parseFilters)
  async filterKardex(req: Request) {
    const data = req.body as Fillime<InvKardex>
    return this.kardexService.filterKardex(data)
  }
}
