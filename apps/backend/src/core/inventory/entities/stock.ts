import { STOCK_STATUS } from './stock_status'

export interface Stock {
  id: number
  itemId: number
  itemName: string
  categoryName: string
  presentationId: number
  presentationName: string
  measureId: number
  warehouseId: string
  stockAt: string
  initialStock: number
  stockCurrent: number
  stockPhysical: number
  unitValue: number
  totalInitial: number
  totalValue: number
  createdBy: string
  status: STOCK_STATUS
  // agregados - modificados
  quantityInMv: number
  quantityInPurchase: number
  quantityInDispatch: number
  quantityOutMv: number
  quantityOutDispatch: number
  quantityOutSale: number
}

export interface StockGeneral extends Omit<Stock, 'id'> {
  id?: number
}
