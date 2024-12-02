import { Sucursal } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { ConfigService } from './config.service'
import { EmailService } from './email.service'
import { OtpService } from './otp.service'

export const sucursalRepository = AppDataSource.getRepository(Sucursal)

export const commonController = new CommonController()
export const commonService = new CommonService(sucursalRepository)

export const otpService = new OtpService(ConfigService.getInstance())
export const emailService = new EmailService(
  ConfigService.getInstance(),
  otpService,
)
