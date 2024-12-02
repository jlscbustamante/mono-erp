import IamFunctionRepository from '../../repositories/iamFuction.repository'
import { createApp } from '../../utils/decorators/endpoint.middleware'
import { iamPermissionRepository, iamUserRepository } from '../repositories'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const authService = new AuthService(
  iamUserRepository,
  IamFunctionRepository,
  iamPermissionRepository,
)
const controller = new AuthController(authService)

createApp(AuthController, controller)
