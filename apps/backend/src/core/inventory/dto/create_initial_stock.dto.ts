export interface CreateInitialStockDto {
  stockAt: string
  storeCode: string
  items: {
    itemId: number
    initialStock: number
  }[]
}
