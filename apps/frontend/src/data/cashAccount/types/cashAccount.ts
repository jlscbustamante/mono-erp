import { CashAccountTypeId } from './cashTypes'
import { CashAccountStatus } from './status'

export interface ICashAccountType {
  id: number
  name: string
  type_id: CashAccountTypeId
  status: string
}

export interface ICashAccount {
  cash_account_type: any
  id: number
  name: string
  roles_id: string
  sucursal_id: string
  account_id: string | number
  type_cash_id: number
  codefis: string
  status: CashAccountStatus
  created_at?: string
  updated_at?: string
}
export interface ICreateCashAccount extends Omit<ICashAccount, 'id'> {
  id: any
}

export interface IFilterCashAccount {
  id?: number
  name?: string
  account_id?: number
  type_cash_id?: number
  codefis?: number
  roles_id?: number
  status?: CashAccountStatus
  created_at?: string
}
