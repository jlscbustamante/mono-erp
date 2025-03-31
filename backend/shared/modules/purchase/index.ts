import type { InvPurchaseSelect } from "../../db/mods.ts";

export interface IPurchaseReportProps {
  start: string;
  end: string;
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
}

export interface IPurchaseReport {
  purchase: InvPurchaseSelect;
  items: IPurchaseReportItem[];
}
