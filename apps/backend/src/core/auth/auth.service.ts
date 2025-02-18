import jwt from 'jsonwebtoken'

interface Credentials {
  token: string
  user: {
    id: number
    name: string
    email: string
    status: number
    rol_id: number
    phone: string
  }
}

interface IUser {
  id: number
  name: string
  email: string
  phone: string
  password: string
  rol_id: number
  email_token: null | string
  email_validate: string
  status: number
  created_at: string
  updated_at: string
}

import { badImplementation, badRequest } from '@hapi/boom'

import config from '../../config/config'
import { AppDataSource } from '../../config/database'
import { OtpService } from '../services/otp.service'

// validate number 9 digits
const validatePhone = (phone: string) => {
  if (/^([0-9]{9})$/.test(phone)) return true
  throw badRequest('Numero de telefono invalido')
}

export class AuthService {
  constructor(private readonly otpService: OtpService) {}

  async loginPhone(phone: string, code?: string) {
    validatePhone(phone)
    const users = await AppDataSource.query(
      'SELECT id FROM iam_user WHERE phone = ?',
      [phone],
    )
    const user = users[0]
    if (!user)
      throw new Error('No existe un usuario con este numero de telefono')
    const token = await this.otpService.sendSms(phone, code)
    return token
  }

  async loginWsp(phone: string, code?: string) {
    validatePhone(phone)
    const users = await AppDataSource.query(
      'SELECT id FROM iam_user WHERE phone = ?',
      [phone],
    )
    const user = users[0]
    if (!user)
      throw new Error('No existe un usuario con este numero de telefono')
    const token = await this.otpService.sendWsp(phone, code)
    return token
  }

  async validateOtp(otp: string, token: string) {
    const phoneUser = this.otpService.validateOtp(otp, token)
    if (!phoneUser) throw badRequest('Otp invalido')
    return await this.getCredentialsByPhone(phoneUser)
  }

  private async getCredentialsByPhone(phone: string): Promise<Credentials> {
    const users = await AppDataSource.query(
      'SELECT * FROM iam_user WHERE phone = ?',
      [phone],
    )
    const user = users[0] as unknown as IUser
    if (!user)
      throw new Error('No existe un usuario con este numero de telefono')
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      rol_id: user.rol_id,
    }
    const token = this.createToken(userData)
    return {
      token,
      user: {
        ...userData,
        phone: user.phone,
      },
    }
  }

  private createToken(payload: any): string {
    const token = jwt.sign(payload as any, config.JWTKey)
    if (!token)
      throw badImplementation(
        'Ocurrio un error al crear el token, payload: ',
        payload,
      )
    return token
  }
}
