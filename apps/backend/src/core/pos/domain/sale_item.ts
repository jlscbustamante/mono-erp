import { Size } from './product_size'

export interface SaleItem {
  id: number
  saleAt: string
  itemId: number
  itemName: string
  productId: number
  productName: string
  productSize: Size
  productQuantity: number
}
