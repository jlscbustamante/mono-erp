import { CostCenter } from '../entities/CostCenter'
import { CostCenterRepository } from '../repositories/costCenter.repository'
import { EnvFilters } from '../types'
import { CostCenterStatus } from '../types/costCenter'
import { dateNow } from '../utils/getDate'

type EditCostCenter = {
  origin: string
  account_caja: number
  account_ajuste: number
  account_merca: number
  is_cash: 0 | 1
  status: CostCenterStatus
}

export class CostCenterService {
  private readonly costCenterRepository: CostCenterRepository
  constructor(costCenterRepository: CostCenterRepository) {
    this.costCenterRepository = costCenterRepository
  }

  async getAll(): Promise<CostCenter[]> {
    return this.costCenterRepository.find({
      where: {
        status: CostCenterStatus.Active,
      },
    })
  }

  async getFilteredCostCenterNt(
    filters: EnvFilters<CostCenter>,
  ): Promise<CostCenter[]> {
    return this.costCenterRepository.filterNt(filters)
  }

  async updateCostCenter(
    existingCostCenter: CostCenter,
    args: EditCostCenter,
  ): Promise<void> {
    try {
      existingCostCenter.updated_at = dateNow()
      existingCostCenter.origin = args.origin
      existingCostCenter.account_caja = args.account_caja
      existingCostCenter.account_ajuste = args.account_ajuste
      existingCostCenter.account_merca = args.account_merca
      existingCostCenter.is_cash = args.is_cash
      existingCostCenter.status = args.status
      await this.costCenterRepository.save(existingCostCenter)
    } catch (error: any) {
      throw new Error(`Error al actualizar CostCenter: ${error}`)
    }
  }

  async createMenuReport(args: EditCostCenter): Promise<void> {
    const newCostCenter = new CostCenter()
    try {
      newCostCenter.updated_at = dateNow()
      newCostCenter.created_at = dateNow()
      newCostCenter.origin = args.origin
      newCostCenter.account_caja = args.account_caja
      newCostCenter.account_ajuste = args.account_ajuste
      newCostCenter.account_merca = args.account_merca
      newCostCenter.is_cash = args.is_cash
      newCostCenter.status = args.status
      await this.costCenterRepository.save(newCostCenter)
    } catch (err: any) {
      throw new Error(`Error al crear CostCenter: ${err}`)
    }
  }
}
