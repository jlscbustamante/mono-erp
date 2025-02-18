import { PinpointClient, SendMessagesCommand } from '@aws-sdk/client-pinpoint'
import { badRequest } from '@hapi/boom'
import axios from 'axios'

import config from '../../config/config'

export class OtpService {
  private vault: {
    token: string
    otp: string
    phone: string
    generatedAt: Date
  }[] = []

  private readonly pinpointClient: PinpointClient = new PinpointClient({
    region: config.aws.pinpoint.region,
    credentials: {
      accessKeyId: config.aws.pinpoint.accessKey,
      secretAccessKey: config.aws.pinpoint.secretKey,
    },
  })

  private readonly wspCode = config.messages.wsp

  constructor() {}

  private clear() {
    this.vault = this.vault.filter((el) => {
      const diff = new Date().getTime() - el.generatedAt.getTime()
      const diffInMinutes = diff / (1000 * 60)
      return diffInMinutes > 10
    })
  }

  clearPhone(phone: string) {
    this.vault = this.vault.filter((el) => el.phone !== phone)
  }

  async sendSms(phone: string, code?: string) {
    this.clear()
    this.clearPhone(phone)
    const { data } = await axios.get(
      `http://ec2-34-239-124-25.compute-1.amazonaws.com/api/OTPUX/${phone}`,
    )
    const otpData: {
      otp: string
      expires: number
      phone: string
      token: string
      validate: boolean
    } = data.result
    this.vault.push({
      generatedAt: new Date(),
      otp: otpData.otp,
      phone: phone,
      token: otpData.token,
    })
    const phoneNumber = `+${code ? code : '51'}${otpData.phone}`
    const command = new SendMessagesCommand({
      ApplicationId: config.aws.pinpoint.applicationId,
      MessageRequest: {
        Addresses: {
          [phoneNumber]: {
            ChannelType: 'SMS',
          },
        },
        MessageConfiguration: {
          SMSMessage: {
            Body:
              'Tu codigo de inicio de sesion para el Erp es : ' + otpData.otp,
            MessageType: 'TRANSACTIONAL',
          },
        },
      },
    })
    try {
      await this.pinpointClient.send(command)
      return otpData.token
    } catch (err: any) {
      console.log('error sms : ', err.message)
      console.log('error sms response: ', err.$response)
      throw new Error('No se pudo enviar SMS')
    }
  }

  async sendWsp(phone: string, code?: string) {
    this.clear()
    this.clearPhone(phone)
    const { data } = await axios.get(
      `http://ec2-34-239-124-25.compute-1.amazonaws.com/api/OTPUX/${phone}`,
    )
    const otpData: {
      otp: string
      expires: number
      phone: string
      token: string
      validate: boolean
    } = data.result

    this.vault.push({
      generatedAt: new Date(),
      otp: otpData.otp,
      phone: phone,
      token: otpData.token,
    })

    const contentWspApi = {
      messages: [
        {
          from: '12039008730',
          to: `${code ? code : '51'}${phone}`,
          content: {
            templateName: 'prauten',
            templateData: {
              body: {
                placeholders: [otpData.otp],
              },
              buttons: [
                {
                  type: 'URL',
                  parameter: otpData.otp,
                },
              ],
            },
            language: 'es_MX',
          },
          callbackData: 'Callback data',
        },
      ],
    }

    const request = await fetch(
      'https://8gwy3e.api.infobip.com/whatsapp/1/message/template',
      {
        method: 'POST',
        headers: {
          Authorization: `App ${this.wspCode}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(contentWspApi),
      },
    )

    let error: string | undefined
    if (!request.ok) {
      try {
        const response = await request.json()
        error =
          response?.message ??
          response?.error ??
          'No se pudo enviar el codigo al wsp'
      } catch (err: any) {
        error = 'Nose pudo enviar el codigo al wsp'
      }
    }
    if (error) throw new Error(error)

    return otpData.token
  }
  validateOtp(otp: string, token: string): string | null {
    const relation = this.vault.find((el) => el.token === token)
    if (!relation) throw badRequest('Token expirado')
    if (relation.otp !== otp) return null
    else {
      const phone = relation.phone
      this.vault = this.vault.filter((el) => el.token !== token)
      return phone
    }
  }
}
