import type { Request, Response } from 'express'

import { catchError } from '../../../utils/decorators'
import { authService } from '../dependencies'

export class AuthController {
  @catchError
  async loginPhone(req: Request, res: Response) {
    const { phone, code } = req.body
    const token = await authService.loginPhone(phone, code)
    return res.json({
      message: 'Sms enviado',
      data: {
        phone,
        token,
      },
    })
  }

  @catchError
  async loginWsp(req: Request, res: Response) {
    const { phone, code } = req.body as { phone: string; code?: string }
    const token = await authService.loginWsp(phone, code)

    return res.json({
      message: 'Codigo enviado',
      data: {
        phone,
        token,
      },
    })
  }

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
