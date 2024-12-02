import IamFunctionRepository from '../../repositories/iamFuction.repository'
import { createApp } from '../../utils/decorators/endpoint.middleware'
import { ConfigService } from '../common/config.service'
import { emailService, otpService } from '../common/dependencies'
import { iamPermissionRepository, iamUserRepository } from '../repositories'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const authService = new AuthService(
  iamUserRepository,
  IamFunctionRepository,
  iamPermissionRepository,
  emailService,
  ConfigService.getInstance(),
  otpService,
)
const controller = new AuthController(authService)

createApp(AuthController, controller)
