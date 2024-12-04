import nodemailer from 'nodemailer'
import { ConfigService } from './config.service'
import { OtpService } from './otp.service'

interface Register {
  email: string
  lastSent: Date
  attempts: number
}

export class EmailService {
  private contentOtp = ''
  private htmlLogin = ''
  private transporter
  private register: Record<string, Register> = {}
  private config = {
    limit: 5,
    interval: 1000 * 60 * 5,
  }

  constructor(
    // private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {
    this.contentOtp = `
          <div style="text-align: center; background-color: #f2f2f2; padding: 10px; max-width: 600px; margin: 20px auto; margin-bottom: 20px;">
        <div style="max-width: 80px; margin: 20px 0; float: left;">
        <img src='https://erpraul.work/_imgs/pizza-logo.png' alt="Imagen" style="width: 100%; height: auto; margin-left: 140px;">
        </div>
        <div style="clear: both;"></div>
        <div style="padding: 10px; max-width: 300px; margin: auto; background-color: white; color: #808080; text-align: left;">
        <p>Hola $$name.</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>En caso no hayas solicitado el reseteo, comunícate con el área de soporte.</p>
        <p>Tu código de verificación es: <strong style="font-size: 18px; color: black;">$$otp</strong>.</p>
        <p>Tienes 5 minutos para poder utilizarlo, ¡suerte!</p>
        </div>
        <div style="padding: 10px; max-width: 300px; max-height: 50px; margin: auto; background-color: #e30613; color: #f2f2f2; font-size: 1em; margin-bottom: 10px;">
        <p style="margin: 0;">¡Gracias!</p>
        <p style="margin: 0;">Equipo de soporte Pizza Raúl.</p>
        </div>
        </div>
    `
    this.htmlLogin = `
          <div style="text-align: center; background-color: #f2f2f2; padding: 10px; max-width: 600px; margin: 20px auto; margin-bottom: 20px;">
        <div style="max-width: 80px; margin: 20px 0; float: left;">
        <img src='https://erpraul.work/_imgs/pizza-logo.png' alt="Imagen" style="width: 100%; height: auto; margin-left: 140px;">
        </div>
        <div style="clear: both;"></div>
        <div style="padding: 10px; max-width: 300px; margin: auto; background-color: white; color: #808080; text-align: left;">
        <p>Hola $$name.</p>
        <p>Se ha recibido tu solicitud para iniciar sesión</p>
        <p>Tu código de verificación es: <strong style="font-size: 18px; color: black;">$$otp</strong>.</p>
        <p>Tienes 5 minutos para poder utilizarlo.</p>
        </div>
        <div style="padding: 10px; max-width: 300px; max-height: 50px; margin: auto; background-color: #e30613; color: #f2f2f2; font-size: 1em; margin-bottom: 10px;">
        <p style="margin: 0;">¡Gracias!</p>
        <p style="margin: 0;">Equipo de soporte Pizza Raúl.</p>
        </div>
        </div>
    `
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('email.host'),
      port: configService.get('email.port'),
      secure: false,
      auth: {
        user: configService.get('email.user'),
        pass: configService.get('email.password'),
      },
    })
  }

  private checkRegister(email: string) {
    if (!this.register[email]) {
      this.register[email] = {
        email,
        lastSent: new Date(),
        attempts: 1,
      }
    } else {
      const now = new Date()
      const diff = now.getTime() - this.register[email].lastSent.getTime()
      if (diff < this.config.interval) {
        this.register[email].attempts++
        if (this.register[email].attempts > this.config.limit) {
          throw new Error(
            'Demasiados intentos, vuelve a intentarlo en un momento',
          )
        }
      } else {
        this.register[email].lastSent = now
        this.register[email].attempts = 1
      }
    }
  }

  async resend(name: string, email: string) {
    this.checkRegister(email)
    const otp = this.otpService.getOtp(email)
    if (!otp)
      throw new Error('No se pudo reenviar el codigo, vuelva a iniciar sesión')

    if (this.configService.get('isDev')) {
      console.log('OTP : ', otp)
    } else {
      const html = this.htmlLogin
        .replace('$$otp', otp.toString())
        .replace('$$name', name)

      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('email.email'),
        subject: '[Pizza raul] Reseto de contraseña',
        html,
      })
    }
  }

  async sendOtp(name: string, email: string) {
    this.checkRegister(email)

    const otp = await this.otpService.generate(email)

    if (this.configService.get('isDev')) {
      console.log('OTP : ', otp)
    } else {
      const html = this.htmlLogin
        .replace('$$otp', otp.toString())
        .replace('$$name', name)

      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('email.email'),
        subject: '[Pizza raul] Verificación de inicio de sesión',
        html,
      })
    }
  }
}
