import { differenceInSeconds } from 'date-fns'
import { ConfigService } from './config.service'
interface OtpRegister {
  emailOrPhone: string
  otp: string
  datetime: Date
  duration: number
  retryCount: number
  version: number
}

export class OtpService {
  private otps: Record<string, OtpRegister> = {}

  constructor(private readonly configService: ConfigService) {}

  async generate(emailOrPhone: string, version = 1) {
    const history = this.otps[emailOrPhone]
    if (history) {
      const now = new Date()
      const diff = differenceInSeconds(history.datetime, now)
      if (history.version > 3 && diff < 5 * 60)
        throw new Error('Debes esperar 5 minutos para volver a intentar')
    }

    const res = await fetch(
      this.configService.get('otpServer') + `/${emailOrPhone}`,
    )

    const data = await res.json()
    if (!data.result.otp) throw new Error('No se pudo generar el otp')
    const otp: string = data.result.otp.toString()

    this.otps[emailOrPhone] = {
      otp,
      datetime: new Date(),
      duration: 5 * 60 * 60,
      emailOrPhone,
      retryCount: 0,
      version,
    }

    return otp
  }

  async resend(emailOrPhone: string) {
    const data = this.otps[emailOrPhone]
    if (!data) throw new Error('No se pudo reenviar el otp')

    return this.generate(emailOrPhone, data.version + 1)
  }

  async validate(emailOrPhone: string, otp: string) {
    const data = this.otps[emailOrPhone]
    if (!data) throw new Error('No se pudo validar el otp')

    const now = new Date()
    const diff = differenceInSeconds(data.datetime, now)
    if (diff > data.duration) throw new Error('El otp ha expirado')
    if (data.retryCount > 3)
      throw new Error('Has intentado muchas veces, intentalo más tarde')

    if (data.otp == otp) return true

    data.retryCount++
    return false
  }
}
