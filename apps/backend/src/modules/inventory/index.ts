import { createApp } from '../../utils/decorators/endpoint.middleware'
import { invDispatchRepository } from '../repositories'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'

const service = new InventoryService(invDispatchRepository)
const controller = new InventoryController(service)

createApp(InventoryController, controller)
