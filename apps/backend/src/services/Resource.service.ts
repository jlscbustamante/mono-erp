import { In } from 'typeorm'

import { CashAccount } from '../entities/CashAccount'
import { Category } from '../entities/Category'
import { CostCenter } from '../entities/CostCenter'
import { CashAccountRepository } from '../repositories/cashAccount.repository'
import { CategoryRepository } from '../repositories/category.repository'
import { CostCenterRepository } from '../repositories/costCenter.repository'
import { CashAccountStatus, CashAccountTypeId } from '../types/cashAccount'
import { CategoryStatus, CategoryTypeId } from '../types/category'
import { CostCenterStatus } from '../types/costCenter'

export class ResourceService {
  constructor(
    private readonly cashAccountRepository: CashAccountRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly costCenterRepository: CostCenterRepository,
  ) {}

  async getCashAccounts(): Promise<CashAccount[]> {
    return this.cashAccountRepository.find({
      where: {
        status: CashAccountStatus.Active,
      },
    })
  }

  async getCashAccountsRequest(): Promise<CashAccount[]> {
    return this.cashAccountRepository.find({
      where: {
        status: CashAccountStatus.Active,
        cash_account_type: {
          type_id: In([CashAccountTypeId.Bank, CashAccountTypeId.Liquidator]),
        },
      },
      order: {
        name: 'ASC',
      },
      relations: ['cash_account_type'],
    })
  }

  async getCashAccountsStore(): Promise<CashAccount[]> {
    return this.cashAccountRepository.find({
      where: {
        status: CashAccountStatus.Active,
        cash_account_type: {
          type_id: CashAccountTypeId.Store,
        },
      },
      order: {
        name: 'ASC',
      },
      relations: ['cash_account_type'],
    })
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
      },
    })
  }

  async getCategoriesRequest(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([
            CategoryTypeId.Standard,
            CategoryTypeId.Detraction,
            CategoryTypeId.Multiple,
          ]),
        },
      },
      relations: ['categoryType'],
    })
  }

  async getCategoriesStore(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([
            CategoryTypeId.Bank,
            CategoryTypeId.Standard,
            CategoryTypeId.Store,
            CategoryTypeId.Multiple,
          ]),
        },
      },
      relations: ['categoryType'],
    })
  }

  async getCostCenters(): Promise<CostCenter[]> {
    return this.costCenterRepository.find({
      where: {
        status: CostCenterStatus.Active,
      },
    })
  }
}
