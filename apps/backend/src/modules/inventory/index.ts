import { dispatchUtil } from '../../router/hex/dependencies'
import { createApp } from '../../utils/decorators/endpoint.middleware'
import {
  invDispatchRepository,
  invStockRepository,
  itemRepository,
  sucursalRepository,
} from '../repositories'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'

export const service = new InventoryService(
  invDispatchRepository,
  invStockRepository,
  sucursalRepository,
  itemRepository,
  dispatchUtil,
)
const controller = new InventoryController(service)

createApp(InventoryController, controller)
