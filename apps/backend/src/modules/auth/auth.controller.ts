import { Request } from 'express'
import { validateToken } from '../../middleware/jwt/validateToken'
import { Get } from '../../utils/decorators/endpoint.middleware'
import { AuthService } from './auth.service'

export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get('/auth/user-info', validateToken)
  async userInfo(req: Request) {
    const userId = req.query.id as string
    return this.authService.userInfo(+userId)
  }
}
