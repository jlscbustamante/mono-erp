import nodemailer from 'nodemailer'
import { ConfigService } from './config.service'
import { OtpService } from './otp.service'

export class EmailService {
  private contentOtp = ''
  private transporter
  // private transporter: nodemailer.Transporter<any>

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

  async sendOtp(name: string, email: string) {
    const otp = await this.otpService.generate(email)

    const html = this.contentOtp
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
