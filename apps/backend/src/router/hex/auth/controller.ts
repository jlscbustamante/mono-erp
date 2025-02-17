import type { Request, Response } from 'express'

import { catchError } from '../../../utils/decorators'
import { authService } from '../dependencies'

export class AuthController {
  @catchError
  async loginPhone(req: Request, res: Response) {
    const { phone } = req.body
    const token = await authService.loginPhone(phone)
    return res.json({
      message: 'Sms enviado',
      data: {
        phone,
        token,
      },
    })
  }

  // @catchError
  // async loginWsp(req: Request, res: Response) {
  //   // const { phone } = req.body
  //   // const token = await authService.loginPhone
  // }

  @catchError
  async validateOtp(req: Request, res: Response) {
    const { otp, token } = req.body
    const phone = await authService.validateOtp(otp, token)
    return res.json({
      message: 'ok',
      data: phone,
    })
  }
}
