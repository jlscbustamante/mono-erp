import { CostCenterIs_cash } from '../is_cash/is_cash'
import { CostCenterStatus } from '../status/status'

export interface ICostCenter {
  id: number
  origin: string
  account_caja: string
  account_ajuste: string
  account_merca: string
  is_cash: CostCenterIs_cash
  status: CostCenterStatus
  created_at?: string
  updated_at?: string
}
export interface ICreateCostCenter extends ICostCenter {
  id: any
}
