import { Request } from 'express'
import { authToken } from '../../middleware/auth-token.middleware'
import { IToken } from '../../types'
import { Get, Post, Put } from '../../utils/decorators/endpoint.middleware'
import { AuthService } from './auth.service'

export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get('/auth/user-validate', authToken)
  async userInfo(req: Request) {
    const user = req.user as IToken
    const data = await this.authService.userValidate(user.id)
    return data
  }

  @Put('/auth/update-role', authToken)
  async updateRole(req: Request) {
    const updatePermission = req.body
    await this.authService.updateRole(updatePermission)
  }

  @Get('/auth/functions', authToken)
  async getFunctions() {
    return await this.authService.getFunctions()
  }

  @Get('/auth/role-permissions', authToken)
  async getRolePermissions(req: Request) {
    const id = req.query.id as string
    return await this.authService.getRolePermissions(+id)
  }

  @Get('/auth/user-permissions', authToken)
  async getUserPermissions(req: Request) {
    const token = req.user as IToken
    return await this.authService.getRolePermissions(token.rol_id)
  }

  @Post('/auth/resend-otp')
  async resendOtp(req: Request) {
    const { token } = req.body
    return await this.authService.resendOtp(token)
  }

  @Post('/auth/login')
  async login(req: Request) {
    const { email, password } = req.body
    return await this.authService.login({ email, password })
  }

  @Post('/auth/validate-login')
  async validateLogin(req: Request) {
    const { token, otp } = req.body
    const data = await this.authService.validateEmailAndLogin({
      otp,
      token,
    })
    return data
  }
}
