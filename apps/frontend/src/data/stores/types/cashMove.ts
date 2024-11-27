import { ICashAccount } from '@/data/cashAccount/types'
import { ICategory } from '@/data/category/types'
import { AccountFlow } from '@/data/types/accountFlow'

import { CashMoveStatus } from './cashMoveStatus'

export interface ICashMove {
  id: number
  description: string
  amount: number
  account_flow: AccountFlow | null
  cash_id: number
  cash_account_id: number
  category_expense_id: number | null
  category_account_id: string | number | null
  status: CashMoveStatus
  created_by: string
  approved_by: string | null
  rejected_by: string | null
  requested_at: string
  approved_at: string | null
  rejected_at: string | null
  created_at: string
  updated_at: string
}

export interface INetCashMove {
  idCatDep: number
  nombreCat: string
  idTienda: number
  idDia: number
  idUsuario: number
  tipo: 'V' | 'F' | 'G'
  descripcion: string
  valor: number
  estado: 'A'
}

export interface IFilteredCashMove extends ICashMove {
  cashAccount: ICashAccount
  category: ICategory | null
}
