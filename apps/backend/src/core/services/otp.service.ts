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

  constructor() {
    // setInterval(
    //   () => {
    //     this.clear()
    //   },
    //   600000, // 10 min
    // )
  }

  private clear() {
    console.log("clear otp's")
    this.vault = this.vault.filter((el) => {
      const diff = new Date().getTime() - el.generatedAt.getTime()
      const diffInMinutes = diff / (1000 * 60)
      return diffInMinutes > 10
    })
  }

  clearPhone(phone: string) {
    this.vault = this.vault.filter((el) => el.phone !== phone)
  }

  async sendSms(phone: string) {
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
    const phoneNumber = `+51${otpData.phone}`
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

  async sendWsp(phone: string) {
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
    const phoneNumber = `+51${otpData.phone}`
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
