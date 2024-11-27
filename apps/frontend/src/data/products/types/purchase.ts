export interface IInvPurchaseItem {
  id: number
  purchaseId: number
  itemId: number
  itemName: string
  brandId: number
  presentationId: number
  presentationName: string
  unitValue: number
  quantity: number
  totalValue: number
  createdAt: string
  updatedAt: string
}

export interface IInvPurchase {
  id: number
  supplierId: number
  supplierName: string
  companySap: string | null
  numInvoice: string | null
  numGuide: string | null
  gloss: string
  purchaseAt: string
  netValue: number
  discount: number
  taxValue: number
  movepayId: number | null
  status: number
  warehouseId?: string
  totalValue: number
  createdBy: string
  items?: IInvPurchaseItem[]
  createdAt: string
  updatedAt: string
}
