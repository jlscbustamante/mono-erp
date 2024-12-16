import { createApp } from '../../utils/decorators/endpoint.middleware'
import { assistancesRepository, rhEmployeeRepository } from '../repositories'
import { HumanResourcesController } from './human-resources.controller'
import { HumanResourcesService } from './human-resources.service'

const service = new HumanResourcesService(
  rhEmployeeRepository,
  assistancesRepository,
)
const controller = new HumanResourcesController(service)

createApp(HumanResourcesController, controller)
