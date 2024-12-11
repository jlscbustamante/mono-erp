import { invPurchaseRepository } from '../../repositories/inventory/purchase.repository'
import { createApp } from '../../utils/decorators/endpoint.middleware'
import { ExtController } from './ext.controller'
import { ExtService } from './ext.service'

const extService = new ExtService(invPurchaseRepository)

const controller = new ExtController(extService)

createApp(ExtController, controller)
