import { Request } from 'express'
import { Get } from '../../utils/decorators/endpoint.middleware'
import { ExtService } from './ext.service'

export class ExtController {
  constructor(readonly extervice: ExtService) {}

  @Get('/ext/get-purchase')
  async getPurchase(req: Request) {
    const purchaseId = req.query.id as string
    return await this.extervice.getPurchase(+purchaseId)
  }
}
