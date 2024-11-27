import { InvSupplier } from '../entities/inventory/Supplier'
import { Supplier } from '../entities/Supplier'
import { invSupplierRepository } from '../repositories/inventory/supplier.repository'
import { SupplierRepository } from '../repositories/supplier.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditSupplier = {
  supplier: string
  legal_name: string
  legal_number: string
  address: string
  legal_account_bco: string
  legal_account_num: string
  legal_account_cci: string
  legal_account_cur: string
  legal_account_type: string
  status: boolean
}

export class SupplierService {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async updateSupplier(
    existingSupplier: Supplier,
    args: EditSupplier,
  ): Promise<void> {
    try {
      existingSupplier.supplier = args.supplier
      existingSupplier.legal_name = args.legal_name
      existingSupplier.legal_number = args.legal_number
      existingSupplier.address = args.address
      existingSupplier.legal_account_bco = args.legal_account_bco
      existingSupplier.legal_account_num = args.legal_account_num
      existingSupplier.legal_account_cci = args.legal_account_cci
      existingSupplier.legal_account_cur = args.legal_account_cur
      existingSupplier.legal_account_type = args.legal_account_type
      existingSupplier.status = args.status
      existingSupplier.updated_at = dateNow()
      await this.supplierRepository.save(existingSupplier)
    } catch (error: any) {
      throw new Error(`Error al actualizar supplier: ${error}`)
    }
  }

  async getFilteredSupplierNt(
    filters: EnvFilters<Supplier>,
  ): Promise<Supplier[]> {
    return this.supplierRepository.filterNt(filters)
  }

  async createSupplier(args: EditSupplier): Promise<void> {
    try {
      const createSupplier = new InvSupplier()
      createSupplier.supplier = args.supplier
      createSupplier.legalName = args.legal_name
      createSupplier.legalNumber = args.legal_number
      createSupplier.address = args.address
      createSupplier.legalAccountBco = args.legal_account_bco
      createSupplier.legalAccountNum = args.legal_account_num
      createSupplier.legalAccountCci = args.legal_account_cci
      createSupplier.legalAccountCur = args.legal_account_cur
      createSupplier.legalAccountType = args.legal_account_type
      createSupplier.status = args.status as any
      createSupplier.createdAt = dateNow()
      createSupplier.updatedAt = dateNow()
      // await this.supplierRepository.save(createSupplier)
      await invSupplierRepository.save(createSupplier as any)
    } catch (err: any) {
      throw new Error(`Error al crear supplier: ${err}`)
    }
  }
}
