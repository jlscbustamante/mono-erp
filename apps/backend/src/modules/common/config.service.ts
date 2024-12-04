import dotenv from 'dotenv'

dotenv.config()

export class ConfigService {
  private static instance: ConfigService

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private config: Record<string, any> = {}

  constructor() {
    this.init()
  }

  private init() {
    const env = process.env
    this.config = {
      isDev: env.NODE_ENV == 'development',
      email: {
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        user: env.EMAIL_USER,
        password: env.EMAIL_PASSWORD,
        email: env.EMAIL_EMAIL,
      },
      otpServer: env.OTP_SERVER,
      auth: {
        jwtLoginSecret: env.JWT_LOGIN_SECRET,
        jwtSecret: env.KEY_JWT,
      },
    }
  }

  get<T = any>(prop: string): T {
    const keys = prop.split('.')
    let value = this.config
    for (const key of keys) {
      value = value[key]
    }
    return value as T
  }
}
