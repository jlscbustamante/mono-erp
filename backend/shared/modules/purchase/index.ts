import type { InvPurchaseSelect } from "../../db/mods.ts";

export interface IPurchaseReportProps {
  start: string;
  end: string;
  item_id?: number;
  supplier_id?: number;
  category_id?: number;
}

export interface IPurchaseReportItem {
  id: number;
  purchase_id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  unit_value: number;
  total_value: number;
  category_id: number;
  category_name?: string;
  unit_measure?: string;
}

export interface IPurchaseReport {
  purchase: InvPurchaseSelect;
  items: IPurchaseReportItem[];
}
