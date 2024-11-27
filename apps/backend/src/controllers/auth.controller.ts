import { NextFunction, Request, Response } from 'express'

import { AuthService } from '../services/Auth.service'

const authService = new AuthService()

export class AuthController {
  async login(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body

      const token = await authService.login(email as string, password as string)

      response.status(200).json(token)
    } catch (err: any) {
      next(err)
    }
  }
}
