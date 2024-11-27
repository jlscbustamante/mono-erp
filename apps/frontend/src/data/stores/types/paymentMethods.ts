import { CashMoveStatus } from '.'

export interface IInfoPaymentMethod {
  sucursalcode: string
  store?: IInfoPaymentMethodStore
  culqi?: number
  izipay?: number
  success?: boolean
}
export interface IInfoPaymentMethodStore {
  cash_id: number
  sucursalcode: string
  name: string
  izipay: string
  online: string
  status_online: CashMoveStatus | null
  status_izipay: CashMoveStatus | null
}

export interface IInfoPos {
  codigo: string
  method: string
  amount: string
}

export interface ITransactionOfMethod {
  id: string
  sucursalcode: string
  terminal: string
  name: string
  date: string
  dateabono: null
  importe: string
  comisionventa: string
  igv: string
  importeneto: string
  numtarjeta: string
  estado: string
}
