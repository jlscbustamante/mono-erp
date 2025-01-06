import { badRequest, unauthorized } from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IamFunction, IamPermission, IamRole, IamUser } from 'pizzadb'
import { Session, UpdateRoleDto } from 'shared'
import { In, Repository } from 'typeorm'
import { AppDataSource } from '../../config/database'
import { Parameters } from '../../parameters'
import { IToken } from '../../types'
import { ConfigService } from '../common/config.service'
import { EmailService } from '../common/email.service'
import { OtpService } from '../common/otp.service'

export class AuthService {
  constructor(
    private readonly iamUserRepository: Repository<IamUser>,
    private readonly iamFunctionRepository: Repository<IamFunction>,
    private readonly iamPermissionRepository: Repository<IamPermission>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly parameters: Parameters,
  ) {}

  async userValidate(userId: number): Promise<Session> {
    const user = await this.iamUserRepository.findOne({
      where: { id: userId },
    })
    if (!user) throw unauthorized('El usuario no fue encontrado')
    if (user.status == 0) throw unauthorized('El usuario no esta activo')
    const permissions = await this.iamPermissionRepository.find({
      select: {
        id: true,
        function: {
          id: true,
          path_view: true,
          module_id: true,
        },
      },
      relations: {
        function: true,
      },
      where: {
        rol_id: user.rol_id,
      },
    })
    const views = permissions.map((el) => el.function.path_view)
    const modules = Array.from(
      new Set(permissions.map((el) => el.function.module_id)),
    )
    return {
      mail: user.email,
      roleId: user.rol_id,
      roleName: user.role.name,
      userId: user.id,
      userName: user.name,
      views,
      modules,
      parameters: this.parameters.getAll(),
    }
  }

  async updateRole(updateRole: UpdateRoleDto) {
    let funciones: IamFunction[] = []
    if (updateRole.permissions.length > 0) {
      funciones = await this.iamFunctionRepository.find({
        where: {
          id: In(updateRole.permissions),
        },
      })
    }
    await AppDataSource.transaction(async (manager) => {
      await manager.update(IamRole, updateRole.id, {
        name: updateRole.name,
        status: updateRole.status,
      })

      await manager.delete(IamPermission, {
        rol_id: updateRole.id,
      })

      if (funciones.length > 0) {
        await manager.insert(
          IamPermission,
          funciones.map((el) => ({
            rol_id: updateRole.id,
            module_id: el.module_id,
            function_id: el.id,
          })),
        )
      }
    })
  }

  async getFunctions() {
    return this.iamFunctionRepository.find()
  }

  async getRolePermissions(roleId: number) {
    return this.iamPermissionRepository.find({
      relations: {
        function: true,
      },
      where: {
        rol_id: roleId,
      },
    })
  }

  async login({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<string> {
    const user = await this.iamUserRepository.findOne({
      where: {
        email,
      },
      relations: {
        role: true,
      },
    })
    if (!user) throw badRequest('El usuario no existe')

    if (user.status == 0) throw badRequest('El usuario no esta activo')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw badRequest('La contraseña es incorrecta')

    await this.emailService.sendOtp(user.name, email)
    const token = jwt.sign(
      { email, name: user.name },
      this.configService.get<string>('auth.jwtLoginSecret'),
      {
        expiresIn: '20m',
      },
    )

    return token
  }

  async resendOtp(token: string) {
    try {
      const isValid = jwt.verify(
        token,
        this.configService.get('auth.jwtLoginSecret'),
      )
      const { email, name } = isValid as { email: string; name: string }
      await this.emailService.resend(name, email)
    } catch (err: any) {
      if (err.message == 'jwt expired')
        throw badRequest('Tiempo de inicio de sesión agotado')
      throw badRequest(err.message)
    }
  }

  async validateEmailAndLogin({ token, otp }: { token: string; otp: string }) {
    try {
      const isValid = jwt.verify(
        token,
        this.configService.get('auth.jwtLoginSecret'),
      )
      if (!isValid) throw badRequest('Token invalido')
      const { email } = isValid as { email: string }

      const user = await this.iamUserRepository.findOne({
        where: {
          email,
        },
      })
      if (!user) throw badRequest('El usuario no existe')
      const isValidOtp = this.otpService.validate(email, otp)

      if (!isValidOtp) throw badRequest('El OTP es incorrecto')

      const data: IToken = {
        id: user.id,
        name: user.name,
        granted: 1,
        mail: user.email,
        rol_id: user.rol_id,
        status: 'A',
      }
      const tokenLogin = jwt.sign(
        data,
        this.configService.get('auth.jwtSecret'),
      )

      const session: Session = await this.userValidate(user.id)

      return {
        token: tokenLogin,
        session,
      }
    } catch (err: any) {
      if (err.message == 'jwt expired')
        throw badRequest('Tiempo de inicio de sesión agotado')
      throw badRequest(err.message)
    }
  }
}
