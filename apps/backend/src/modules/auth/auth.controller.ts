import { Request } from 'express'
import { authToken } from '../../middleware/auth-token.middleware'
import { IToken } from '../../types'
import { Get } from '../../utils/decorators/endpoint.middleware'
import { AuthService } from './auth.service'

export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get('/auth/user-validate', authToken)
  async userInfo(req: Request) {
    const user = req.user as IToken
    const data = await this.authService.userValidate(user.id)
    return data
  }
}
