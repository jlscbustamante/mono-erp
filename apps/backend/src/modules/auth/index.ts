import { createApp } from '../../utils/decorators/endpoint.middleware'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const authService = new AuthService()
const controller = new AuthController(authService)

createApp(AuthController, controller)
