export enum PURCHASE_STATUS {
  NEW = 1,
  STORED = 3,
}

export interface Purchase {
  id: number
  gloss: string
  items: PurchaseItem[]
  supplierId: number
  purchaseAt: string
  status: PURCHASE_STATUS
  numInvoice: string
  numGuide: string
  warehouseId: string
  discount: number
  taxValue: number | null
}

export interface PurchaseItem {
  id: number
  purchaseId: number
  itemId: number
  itemName: string
  presentationId: number
  presentationName: string
  unitValue: number
  quantity: number
  totalValue: number
}
