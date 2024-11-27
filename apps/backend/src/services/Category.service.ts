import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { CategoryType } from '../entities/CategoryType'
import { CategoryRepository } from '../repositories/category.repository'
import { EnvFilters } from '../types'
import {
  CategoryAccountFlow,
  CategoryStatus,
  CategoryTypeMove,
} from '../types/category'

type EditCategory = {
  name: string
  account_id: number
  type_category_id: number
  codEfis: number
  cash_flow: string
  account_flow: CategoryAccountFlow
  roles_id: number
  m_order: number
  type_mov: CategoryTypeMove
  status: CategoryStatus
  category_type: CategoryType
  account: Account
}

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async updateCategory(
    existingCategory: Category,
    args: EditCategory,
  ): Promise<void> {
    try {
      existingCategory.name = args.name
      existingCategory.account_id = args.account_id
      existingCategory.type_category_id = args.type_category_id
      existingCategory.account_flow = args.account_flow
      existingCategory.roles_id = args.roles_id
      existingCategory.m_order = args.m_order
      existingCategory.type_mov = args.type_mov
      existingCategory.cash_flow = args.cash_flow
      existingCategory.codEfis = args.codEfis
      existingCategory.status = args.status
      existingCategory.categoryType = args.category_type
      existingCategory.account = args.account
      await this.categoryRepository.save(existingCategory)
    } catch (error: any) {
      throw new Error(`Error al actualizar la category: ${error}`)
    }
  }

  async getFilteredTypeNt(filters: EnvFilters<Category>): Promise<Category[]> {
    return this.categoryRepository.filterNt(filters)
  }

  async createCategory(args: EditCategory): Promise<void> {
    const newCategory = new Category()
    try {
      newCategory.name = args.name
      newCategory.account_id = args.account_id
      newCategory.type_category_id = args.type_category_id
      newCategory.account_flow = args.account_flow
      newCategory.m_order = args.m_order
      newCategory.roles_id = args.roles_id
      newCategory.roles_id = args.roles_id
      newCategory.type_mov = args.type_mov
      newCategory.cash_flow = args.cash_flow
      newCategory.codEfis = args.codEfis
      newCategory.status = args.status
      newCategory.categoryType = args.category_type
      newCategory.account = args.account
      await this.categoryRepository.save(newCategory)
    } catch (error: any) {
      throw new Error(`Error al actualizar la category: ${error}`)
    }
  }
}
