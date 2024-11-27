import { PurchaseUpdaetDto } from '../../dto'
import { Purchase, PURCHASE_STATUS } from '../purchase'

export interface PurchaseRepository {
  getPurchase(purchaseId: number): Promise<Purchase | null>

  changePurchaseStatus(
    purchaseId: number,
    status: PURCHASE_STATUS,
  ): Promise<void>

  updatePurchase(purchase: PurchaseUpdaetDto): Promise<void>
}
