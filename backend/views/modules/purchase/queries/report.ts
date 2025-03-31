import { db } from "#app/config/database.ts";
import {
  IPurchaseReport,
  IPurchaseReportItem,
  IPurchaseReportProps,
} from "@scope/shared";
import { sql } from "kysely";

export const purchase_report = async (
  props: IPurchaseReportProps
): Promise<IPurchaseReport[]> => {
  const purchase_list = await db
    .selectFrom("inv_purchase")
    .selectAll()
    .where((eb) => eb.between(sql`DATE(purchase_at)`, props.start, props.end))
    .execute();

  const ids = purchase_list.map((item) => item.id);
  const result_items = await db
    .selectFrom("inv_purchase_item as ip")
    .innerJoin("inv_item as ii", "ii.id", "ip.item_id")
    .select([
      "ip.id",
      "ip.purchase_id",
      "ip.item_name",
      "ip.item_id",
      "ip.quantity",
      "ip.unit_value",
      "ip.total_value",
      "ii.category_id",
    ])
    .where("purchase_id", "in", ids)
    .execute();
  const purchase_items: IPurchaseReportItem[] = result_items.map((el) => ({
    ...el,
    quantity: +el.quantity,
    total_value: +el.total_value,
    unit_value: +el.unit_value,
  }));

  const list: IPurchaseReport[] = [];
  for (const purchase of purchase_list) {
    const items = purchase_items.filter(
      (item) => item.purchase_id === purchase.id
    );
    list.push({ purchase, items });
  }
  return list;
};
