import { Parameter } from '../entities/Parameter'
import { ParameterRepository } from '../repositories/parameter.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditParameters = {
  type: string
  name: string
  value: string
  role: string
  status: 0 | 1
}

export class ParametersService {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  async updateParameters(
    existingParameter: Parameter,
    args: EditParameters,
  ): Promise<void> {
    try {
      existingParameter.type = args.type
      existingParameter.name = args.name
      existingParameter.value = args.value
      existingParameter.role = args.role
      existingParameter.status = args.status
      existingParameter.updated_at = dateNow()
      await this.parameterRepository.save(existingParameter)
    } catch (error: any) {
      throw new Error(`Error al actualizar el Parameter: ${error}`)
    }
  }

  async getFilteredParametersNt(
    filters: EnvFilters<Parameter>,
  ): Promise<Parameter[]> {
    return this.parameterRepository.filterNt(filters)
  }

  async createParameters(args: EditParameters): Promise<void> {
    try {
      const newParameter = new Parameter()
      newParameter.type = args.type
      newParameter.name = args.name
      newParameter.value = args.value
      newParameter.role = args.role
      newParameter.status = args.status
      newParameter.updated_at = dateNow()
      newParameter.created_at = dateNow()
      await this.parameterRepository.save(newParameter)
    } catch (err: any) {
      throw new Error(`Error al crear el Parameter : ${err}`)
    }
  }
}
