import { IamFunction } from '../entities/IamFuction'
import { IamRole } from '../entities/IamRole'
import IamFunctionRepository from '../repositories/iamFuction.repository'
import { IamRoleRepository } from '../repositories/IamRole.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditIamRole = {
  name: string
  status: number
}

export class IamRoleService {
  private readonly IamRoleRepository: IamRoleRepository
  constructor(IamRoleRepository: IamRoleRepository) {
    this.IamRoleRepository = IamRoleRepository
  }

  async getFilteredIamRoleNt(filters: EnvFilters<IamRole>): Promise<IamRole[]> {
    return this.IamRoleRepository.filterNt(filters)
  }

  async updateIamRole(
    existingIamRole: IamRole,
    args: EditIamRole,
  ): Promise<void> {
    try {
      existingIamRole.status = args.status
      existingIamRole.name = args.name
      existingIamRole.updated_at = dateNow()
      await this.IamRoleRepository.save(existingIamRole)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamRole(args: EditIamRole): Promise<void> {
    const newIamRole = new IamRole()
    try {
      ;(newIamRole.status = args.status),
        (newIamRole.name = args.name),
        (newIamRole.created_at = dateNow()),
        (newIamRole.updated_at = dateNow())

      await this.IamRoleRepository.save(newIamRole)
    } catch (err: any) {
      throw new Error(`Error al crear IamRole: ${err}`)
    }
  }
}
