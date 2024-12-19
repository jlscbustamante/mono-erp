import { Parameters } from '../../parameters'
import { createApp } from '../../utils/decorators/endpoint.middleware'
import {
  assistancesRepository,
  jobsTitleRepository,
  rhEmployeeRepository,
  sucursalRepository,
} from '../repositories'
import { HumanResourcesController } from './human-resources.controller'
import { HumanResourcesService } from './human-resources.service'

const service = new HumanResourcesService(
  rhEmployeeRepository,
  assistancesRepository,
  jobsTitleRepository,
  sucursalRepository,
  Parameters.getInstance(),
)
const controller = new HumanResourcesController(service)

createApp(HumanResourcesController, controller)
