import { CashBalanceStatus } from '@/data/types'

export enum StatusCompare {
  Cerrado = 'Cerrado',
  Contabilizado = 'Contabilizado',
  Pendiente = 'Pendiente',
  Listo = 'Listo para el cierre',
  Descuadre = 'Descuadre',
}
export interface ICompareEfis {
  storeId: number
  efis: number
  admin: {
    balance: number
    status: CashBalanceStatus
  }
  pendingMovements: number
  status: StatusCompare[]
  success: boolean
  nameStore: string
  date: string
}
