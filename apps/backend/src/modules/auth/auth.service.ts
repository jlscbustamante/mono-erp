import { unauthorized } from '@hapi/boom'
import { IamFunction, IamPermission, IamRole, IamUser } from 'pizzadb'
import { Session, UpdateRoleDto } from 'shared'
import { In, Repository } from 'typeorm'
import { AppDataSource } from '../../config/database'

export class AuthService {
  constructor(
    private readonly iamUserRepository: Repository<IamUser>,
    private readonly iamFunctionRepository: Repository<IamFunction>,
    private readonly iamPermissionRepository: Repository<IamPermission>,
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
}
