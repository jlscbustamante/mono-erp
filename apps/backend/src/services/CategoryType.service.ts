import { CategoryType } from '../entities/CategoryType'
import { CategoryTypeRepository } from '../repositories/categoryType.repository'
import { EnvFilters } from '../types'
import { CategoryTypeId } from '../types/category'

type EditCategoryType = {
  name: string
  type_id: CategoryTypeId
  status: 'A' | 'E'
}

export class CategoryTypeService {
  constructor(
    private readonly categoryTypeRepository: CategoryTypeRepository,
  ) {}

  async getFilteredCategoryTypeNt(
    filters: EnvFilters<CategoryType>,
  ): Promise<CategoryType[]> {
    return this.categoryTypeRepository.filterNt(filters)
  }

  async updateCategory(
    existingCategoryType: CategoryType,
    args: EditCategoryType,
  ) {
    try {
      existingCategoryType.name = args.name
      existingCategoryType.type_id = args.type_id
      existingCategoryType.status = args.status
      return await this.categoryTypeRepository.save(existingCategoryType)
    } catch (error: any) {
      throw new Error(`Error al actualizar CategoryType: ${error}`)
    }
  }

  async createCategoryType(args: EditCategoryType) {
    const newCategoryType = new CategoryType()
    try {
      newCategoryType.name = args.name
      newCategoryType.status = args.status
      newCategoryType.type_id = args.type_id
      return await this.categoryTypeRepository.save(newCategoryType)
    } catch (err: any) {
      throw new Error(`Error al crear CategoryType: ${err}`)
    }
  }
}
