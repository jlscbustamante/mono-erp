import { ConfigService } from './config.service'
interface OtpRegister {
  emailOrPhone: string
  otp: string
  datetime: Date
  retryCount: number
}

export class OtpService {
  private otps: Record<string, OtpRegister> = {}
  private readonly config = {
    duration: 1000 * 60 * 5,
    maxRetry: 3,
  }

  constructor(private readonly configService: ConfigService) {}

  async generate(emailOrPhone: string) {
    const res = await fetch(
      this.configService.get('otpServer') + `/${emailOrPhone}`,
    )

    const data = await res.json()
    if (!data.result.otp) throw new Error('No se pudo generar el otp')
    const otp: string = data.result.otp.toString()

    this.otps[emailOrPhone] = {
      otp,
      datetime: new Date(),
      emailOrPhone,
      retryCount: 0,
    }

    return otp
  }

  validate(emailOrPhone: string, otp: string): boolean {
    const data = this.otps[emailOrPhone]
    if (!data) throw new Error('No se pudo validar el otp')

    const now = new Date()
    const diff = data.datetime.getTime() - now.getTime()
    if (diff > this.config.duration)
      throw new Error('El otp ha expirado, vuelve a generar uno')

    if (data.retryCount > this.config.maxRetry) {
      throw new Error('Has intentado muchas veces, vuelve a generar el codigo')
    }
    const isSuccessful = data.otp == otp
    if (isSuccessful) {
      return true
    }
    const retryCount = data.retryCount + 1

    if (retryCount > this.config.maxRetry) {
      throw new Error('Has intentado muchas veces, vuelve a generar el codigo')
    } else {
      this.otps[emailOrPhone].retryCount = retryCount
      return false
    }
  }
}
