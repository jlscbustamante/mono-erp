/**
 * @description DTO de un item para movimiento entre tiendas
 */
export interface MoveItemDto {
  itemId: number
  quantity: number
}

export interface MoveBetweenStoresDto {
  storeToId: string
  storeFrom: string
  moveAt: string
  gloss: string
  items: MoveItemDto[]
}
