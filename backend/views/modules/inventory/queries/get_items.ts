import { db } from "#app/config/database.ts";
import { redis } from "#app/config/redis.ts";
import type { IItem } from "@scope/shared";
import { minutesToSeconds } from "date-fns";

export const get_items = async (): Promise<IItem[]> => {
  const cache = await redis.get("erp:items");
  if (cache) {
    return JSON.parse(cache) as IItem[];
  }

  const items = await db
    .selectFrom("inv_item as it")
    .innerJoin("inv_subcategory as pro", "pro.id", "it.subcategory_id")
    .innerJoin("inv_presentation as pre", "pre.id", "it.presentation_id")
    .select([
      "it.id as item_id",
      "it.item_name",
      "it.presentation_id",
      "pre.presentation as presentation_name",
      "pro.id as product_id",
      "pro.category_id as product_category_id",
      "pro.measure_id as product_measure_id",
      "it.unit_cost as warehouse_cost",
      "it.unit_price as store_price",
      "it.status",
      "it.supplier_id",
      "it.brand_id",
    ])
    .execute();

  const items_formatted = items.map(
    (item) =>
      ({
        item_id: item.item_id,
        item_name: item.item_name,
        presentation_id: item.presentation_id,
        presentation_name: item.presentation_name,
        product_category_id: item.product_category_id ?? 0,
        product_measure_id: item.product_measure_id ?? 0,
        warehouse_cost: item.warehouse_cost ? +item.warehouse_cost : 0,
        store_price: item.store_price ? +item.store_price : 0,
        status: item.status,
        is_active: item.status == 1,
        supplier_id: item.supplier_id,
        brand_id: item.brand_id,
      } satisfies IItem)
  );

  await redis.set(
    "erp:items",
    JSON.stringify(items_formatted),
    "EX",
    minutesToSeconds(60 * 5)
  );

  return items_formatted;
};
