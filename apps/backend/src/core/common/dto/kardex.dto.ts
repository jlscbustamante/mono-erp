import { KARDEX_MOVE_FLOW } from "shared"

export enum KARDEX_ORIGIN {
  PURCHASE = 'C',
  PRODUCTION = 'P',
  DISPATCH = 'D',
  INITIAL_STOCK = 'I',
}



export interface KardexCreateDto {
  itemId: number
  origin: KARDEX_ORIGIN
  originId: number
  moveType: KARDEX_MOVE_FLOW
  typeDoc: string | null
  numDoc: string | null
  warehouseId: string
  moveAt: string
  quantity: number
  createdBy: string
  purchasePrice?: number
}
