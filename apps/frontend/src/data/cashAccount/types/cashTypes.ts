import { CashAccountStatus } from './status'

export enum CashAccountTypeId {
  Store = 'T',
  Bank = 'B',
  Temporal = 'M',
  Liquidator = 'L',
  Corales = 'P',
  Central = 'N',
}
export interface ITypeCashAccount {
  id: number
  name: string
  type_id: number
  status: CashAccountStatus
  created_at: string
  updated_at: string
}
export interface ICreateTypeCashAccount extends Omit<ITypeCashAccount, 'id'> {
  id: any
}

export interface IFilterCashAccountType {
  id?: number
  name?: string
  type_id?: number
  status?: CashAccountStatus
  created_at?: string
  updated_at?: string
}
