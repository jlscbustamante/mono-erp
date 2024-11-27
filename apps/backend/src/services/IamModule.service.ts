import { IamModule } from '../entities/IamModule'
import { IamModuleRepository } from '../repositories/iamModule.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditIamModule = {
  name: string
  status: number
}

export class IamModuleService {
  private readonly IamModuleRepository: IamModuleRepository
  constructor(IamModuleRepository: IamModuleRepository) {
    this.IamModuleRepository = IamModuleRepository
  }

  async getFilteredIamModuleNt(
    filters: EnvFilters<IamModule>,
  ): Promise<IamModule[]> {
    return this.IamModuleRepository.filterNt(filters)
  }

  async updateIamModule(
    existingIamModule: IamModule,
    args: EditIamModule,
  ): Promise<void> {
    try {
      existingIamModule.status = args.status
      existingIamModule.name = args.name
      existingIamModule.updated_at = dateNow()
      await this.IamModuleRepository.save(existingIamModule)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamModule(args: EditIamModule): Promise<void> {
    const newIamModule = new IamModule()
    try {
      newIamModule.status = args.status
      newIamModule.name = args.name
      newIamModule.created_at = dateNow()
      newIamModule.updated_at = dateNow()

      await this.IamModuleRepository.save(newIamModule)
    } catch (err: any) {
      throw new Error(`Error al crear IamModule: ${err}`)
    }
  }
}
