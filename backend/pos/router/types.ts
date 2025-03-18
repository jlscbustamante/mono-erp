export interface IStock {
  categoryName: string;
  createdBy: string;
  initialStock: number;
  itemId: number;
  itemName: string;
  measureId: number;
  presentationId: number;
  presentationName: string;
  quantityInDispatch: number;
  quantityInMv: number;
  quantityInPurchase: number;
  quantityOutDispatch: number;
  quantityOutMv: number;
  quantityOutSale: number;
  status: number;
  stockAt: string;
  stockCurrent: number;
  stockPhysical: number;
  totalValue: number;
  unitValue: number;
  warehouseId: string;
}

export interface MoveInfo {
  date: string;
  description: string;
  quantity: number;
  itemId: number;
  actor?: string;
  itemName: string;
}
