import { SupplierStatus } from '../status/status'

export interface ISupplier {
  id: number
  supplier: string
  legal_name: string
  legal_number: string
  address: string
  legal_account_bco: string
  legal_account_num: string
  legal_account_cci: string
  legal_account_cur: string
  legal_account_type: string
  status: SupplierStatus
  created_at: string
}

export interface IFilterSupplier {
  id?: number
  supplier?: string
  legal_name?: string
  legal_number?: string
  address?: string
  legal_account_bco?: string
  legal_account_num?: string
  legal_account_cci?: string
  legal_account_cur?: string
  legal_account_type?: string
  status?: SupplierStatus
}
export interface ICreateSupplier extends Omit<ISupplier, 'id'> {
  id: any
}
