export enum KARDEX_ORIGIN {
  PURCHASE = 'C',
  PRODUCTION = 'P',
  DISPATCH = 'D',
  INITIAL_STOCK = 'I',
}

export enum KARDEX_MOVE_TYPE {
  IN = 'E',
  OUT = 'S',
}

export interface KardexCreateDto {
  itemId: number
  origin: KARDEX_ORIGIN
  originId: number
  moveType: KARDEX_MOVE_TYPE
  typeDoc: string | null
  numDoc: string | null
  warehouseId: string
  moveAt: string
  quantity: number
  createdBy: string
  purchasePrice?: number
}
