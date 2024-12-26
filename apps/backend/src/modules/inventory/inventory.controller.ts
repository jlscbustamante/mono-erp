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

  @Get('/inventory/template/items')
  async getItemsTemplate(req: Request) {
    const { company } = req.query as { company?: string }
    const searchCompany = company || 'PIZZA'
    const data = await this.inventoryService.getItemsTemplate(searchCompany)
    return data
  }

  @Get('/inventory/template/dispatch')
  async getDispatchTemplate(req: Request) {
    const { company = 'PIZZA', sucursalCode } = req.query as {
      sucursalCode: string
      company?: string
    }

    const data = await this.inventoryService.getDispatchTemplate(
      sucursalCode,
      company,
    )

    return data
  }

  @Get('/inventory/sucursales')
  async sucursales(){
    return this.inventoryService.sucursales()
  }
}
