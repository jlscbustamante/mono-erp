export interface CreateInitialStockDto {
  company?: string
  stockAt: string
  storeCode: string
  items: {
    itemId: number
    initialStock: number
  }[]
}
