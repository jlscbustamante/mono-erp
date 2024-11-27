export interface IInvStock {
  id: number
  productId: number
  productItemId: number
  brandId: number
  presentationId: number
  warehouseId: number
  stockAt: string
  stockLast: number
  quantityIn: number
  quantityOut: number
  stockCurrent: number
  unitValue: number
  totalValue: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface IInvKardex {
  id: number
  productId: number
  productItemId: number
  brandId: number
  presentationId: number
  moveId: number
  moveType: string
  moveFlow: string
  typeDoc: string
  numDock: string
  moveAt: string
  warehouseId: number
  quantity: number
  unitPurchase: number
  unitPrice: number
  totalPrice: number
  stockLast: number
  stockCurrent: number
  createdBy: string
  createdAt: string
  updatedAt: string
}
