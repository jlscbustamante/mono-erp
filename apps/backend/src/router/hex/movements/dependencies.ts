import { GlueService } from '../../../services/aws/glue.service'
import { MovementService } from './movement.service'

export const glueService = new GlueService()
export const movementService = new MovementService(glueService)
