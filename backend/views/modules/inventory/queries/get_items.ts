import { db } from "#app/config/database.ts";

export const get_items = async () => {
  const items = await db
    .selectFrom("inv_item")
    .selectAll()
    .innerJoin("inv_product", "inv_product.id", "inv_item.product_id")
    .execute();
  return items;
};
