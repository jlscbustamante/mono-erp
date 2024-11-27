export interface ICostCenter {
  id: number
  origin: string
  account_caja: number | string
  account_ajuste: number | string
  account_merca: number | string
  is_cash: number
  status: number
  created_at: string
  updated_at: string
}
export interface IFilterCostCenter {
  id?: number
  origin?: string
  account_caja?: number | string
  account_ajuste?: number | string
  account_merca?: number | string
  is_cash?: number
  status?: number
  created_at?: string
  updated_at?: string
}
