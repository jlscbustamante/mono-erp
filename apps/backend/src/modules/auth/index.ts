import { createApp } from '../../utils/decorators/endpoint.middleware'
import { iamUserRepository } from '../repositories'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const authService = new AuthService(iamUserRepository)
const controller = new AuthController(authService)

createApp(AuthController, controller)
