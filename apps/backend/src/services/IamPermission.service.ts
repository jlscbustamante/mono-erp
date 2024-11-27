import { IamPermission } from '../entities/IamPermission'
import { IamPermissionRepository } from '../repositories/iamPermission.repository'
import { EnvFilters } from '../types'

type EditIamPermission = {
  rol_id: number
  module_id: number
  function_id: number
  granted: number
}

export class IamPermissionService {
  private readonly iamPermissionRepository: IamPermissionRepository
  constructor(iamPermissionRepository: IamPermissionRepository) {
    this.iamPermissionRepository = iamPermissionRepository
  }

  async getFilteredIamLogNt(
    filters: EnvFilters<IamPermission>,
  ): Promise<IamPermission[]> {
    return this.iamPermissionRepository.filterNt(filters)
  }

  async updateIamPermission(
    existingIamPermission: IamPermission,
    args: EditIamPermission,
  ): Promise<void> {
    try {
      existingIamPermission.function_id = args.function_id
      existingIamPermission.granted = args.granted
      existingIamPermission.module_id = args.module_id
      existingIamPermission.rol_id = args.rol_id
      await this.iamPermissionRepository.save(existingIamPermission)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamPermission(args: EditIamPermission[]): Promise<void> {
    try {
      await this.iamPermissionRepository.save(args)
    } catch (err: any) {
      throw new Error(`Error al crear IamPermission: ${err}`)
    }
  }

  async deleteIamPermissionsByRolId(id: string): Promise<void> {
    try {
      await this.iamPermissionRepository
        .createQueryBuilder()
        .delete()
        .from(IamPermission)
        .where('rol_id = :id', { id })
        .execute()
    } catch (error: any) {
      throw new Error(`Error al eliminar permisos por rol: ${error}`)
    }
  }
}
