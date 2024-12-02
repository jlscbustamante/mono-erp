import { IamFunction } from 'pizzadb'
import { IamFunctionRepository } from '../repositories/iamFuction.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditIamFunction = {
  name: string
  module_id: number
  status: number
}

export class IamFunctionService {
  private readonly IamFunctionRepository: IamFunctionRepository
  constructor(IamFunctionRepository: IamFunctionRepository) {
    this.IamFunctionRepository = IamFunctionRepository
  }

  async getFilteredIamFunctionNt(
    filters: EnvFilters<IamFunction>,
  ): Promise<IamFunction[]> {
    return this.IamFunctionRepository.filterNt(filters)
  }

  async updateIamFunction(
    existingIamFunction: IamFunction,
    args: EditIamFunction,
  ): Promise<void> {
    try {
      ;(existingIamFunction.status = args.status),
        (existingIamFunction.name = args.name),
        (existingIamFunction.module_id = args.module_id),
        (existingIamFunction.updated_at = dateNow())
      await this.IamFunctionRepository.save(existingIamFunction)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamFunction(args: EditIamFunction): Promise<void> {
    const newIamFunction = new IamFunction()
    try {
      ;(newIamFunction.status = args.status),
        (newIamFunction.module_id = args.module_id),
        (newIamFunction.name = args.name),
        (newIamFunction.created_at = dateNow()),
        (newIamFunction.updated_at = dateNow())

      await this.IamFunctionRepository.save(newIamFunction)
    } catch (err: any) {
      throw new Error(`Error al crear IamFunction: ${err}`)
    }
  }
}
