import { Purchase, PurchaseItem } from '../entities/purchase'

export interface PurchaseItemUpdate extends Omit<PurchaseItem, 'id'> {
  id: undefined | number
}

export interface PurchaseUpdaetDto extends Omit<Purchase, 'items'> {
  items: PurchaseItemUpdate[]
}
