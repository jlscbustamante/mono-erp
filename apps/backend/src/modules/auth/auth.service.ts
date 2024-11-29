import { unauthorized } from '@hapi/boom'
import { IamUser } from 'pizzadb'
import { Session } from 'shared'
import { Repository } from 'typeorm'

export class AuthService {
  constructor(private readonly iamUserRepository: Repository<IamUser>) {}

  async userValidate(userId: number): Promise<Session> {
    const user = await this.iamUserRepository.findOne({
      where: { id: userId },
    })
    if (!user) throw unauthorized('El usuario no fue encontrado')
    if (user.status == 0) throw unauthorized('El usuario no esta activo')
    return {
      mail: user.email,
      roleId: user.rol_id,
      roleName: user.role.name,
      userId: user.id,
      userName: user.name,
    }
  }
}
