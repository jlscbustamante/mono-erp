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
    .$if(props.supplier_id != undefined, (qb) =>
      qb.where("inv_purchase.supplier_id", "=", props.supplier_id!)
    )
    .execute();

  const ids = purchase_list.map((item) => item.id);
  const result_items = await db
    .selectFrom("inv_purchase_item as ip")
    .innerJoin("inv_item as ii", "ii.id", "ip.item_id")
    .innerJoin("inv_product as ipro", "ipro.id", "ii.product_id")
    .innerJoin("inv_category", "inv_category.id", "ipro.category_id")
    .innerJoin("inv_measure", "inv_measure.id", "ipro.measure_id")
    .select([
      "ip.id",
      "ip.purchase_id",
      "ip.item_name",
      "ip.item_id",
      "ip.quantity",
      "ip.unit_value",
      "ip.total_value",
      "ipro.category_id",
      "inv_measure.code",
      "inv_category.category",
    ])
    .where("purchase_id", "in", ids)
    .$if(props.item_id != undefined, (qb) =>
      qb.where("ip.item_id", "=", props.item_id!)
    )
    .$if(props.category_id != undefined, (qb) =>
      qb.where("ipro.category_id", "=", props.category_id!)
    )
    .execute();
  const purchase_items: IPurchaseReportItem[] = result_items.map((el) => ({
    ...el,
    category_name: el?.category,
    unit_measure: el?.code ?? undefined,
    category_id: el?.category_id ? +el.category_id : 0,
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
