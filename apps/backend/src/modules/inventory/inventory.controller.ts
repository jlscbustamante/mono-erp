import type { Request } from 'express'
import { Get } from '../../utils/decorators/endpoint.middleware'
import { InventoryService } from './inventory.service'

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/inventory/order')
  async createOrder() {
    return this.inventoryService.createOrder()
  }

  @Get('/inventory/stock/edit')
  async getStockEditTemplate(req: Request) {
    const { store, date } = req.query as { store: string; date: string }
    return this.inventoryService.getStockToEdit(store, date)
  }
}
