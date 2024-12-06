import { Get } from '../../utils/decorators/endpoint.middleware'
import { InventoryService } from './inventory.service'

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/inventory/order')
  async createOrder() {
    return this.inventoryService.createOrder()
  }
}
