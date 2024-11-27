import { AccountFlow } from '@/data/types/accountFlow'

import { CategoryTypeMove } from '.'
import { CategoryStatus } from './status'

export interface ICategory {
  id: number
  name: string
  account_id: string | number
  type_category_id: number
  cash_flow: AccountFlow
  account_flow: AccountFlow
  roles_id: number
  type_mov: CategoryTypeMove
  m_order: number
  codEfis: number
  status: CategoryStatus
}
export interface ITypeCategory {
  id: number
  name: string
  type_id: string
  status: CategoryStatus
}

export interface ICreateCategory extends Omit<ICategory, 'id'> {
  id: any
}
export interface ICreateTypeCategory extends Omit<ITypeCategory, 'id'> {
  id: any
}
export interface IFilterCategory {
  id?: number
  name: string
  account_id?: string | number
  type_category_id?: number
  cash_flow?: AccountFlow
  account_flow?: AccountFlow
  roles_id?: number
  type_mov?: CategoryTypeMove
  m_order?: number
  codEfis?: number
  status: CategoryStatus
}
export interface IFilterTypeCategory {
  id?: number
  name?: string
  type_id: string
  status: CategoryStatus
}
