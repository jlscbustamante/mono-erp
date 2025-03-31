import type { InvEquivalenceSelect } from "../../db/mods.ts";

export enum DISPATCH_MOVE_TYPE {
  WAREHOUSE_TO_STORE = "D",
  STORE_TO_STORE = "M",
  EXCEPTIONAL = "E",
}
export enum DISPATCH_STATUS {
  NEW = 1,
  APPROVED = 2,
  DISPATCHED = 3,
  CANCELLED = 0,
  INVOICED = 4,
  INVOICED_WITH_TRACKING = 5,
}

export interface DispatchItem {
  id: number;
  dispatchId: number;
  itemId: number;
  itemName: string;
  presentationId: number;
  presentationName: string;
  measureId: number;
  measureCode: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface Dispatch {
  id: number;
  wareToId: string;
  wareToName: string;
  wareFromId: string;
  wareFromName: string;
  dispatchAt: string;
  numInvoice: string;
  numGuide: string;
  taxValue: number;
  gloss: string;
  moveType: DISPATCH_MOVE_TYPE;
  netValue: number;
  totalValue: number;
  status: DISPATCH_STATUS;
  requestBy: string;
  approvedBy: string;
  items: DispatchItem[];
}

export interface DispatchItemAddDto
  extends Omit<DispatchItem, "id" | "measureCode"> {
  id?: number;
}

export interface DispatchUpdateDto extends Omit<Dispatch, "items"> {
  items: DispatchItemAddDto[];
}

export interface IItem {
  item_id: number;
  item_name: string;
  presentation_id: number;
  presentation_name: string;
  product_category_id: number;
  product_measure_id: number;
  warehouse_cost: number;
  store_price: number;
  status: number;
  is_active: boolean;
  supplier_id: number;
  brand_id: number;
}

export interface ITemplate {
  item_stock: IItem;
  item_dispatch: IItem;
  equivalency: InvEquivalenceSelect | null;
}
