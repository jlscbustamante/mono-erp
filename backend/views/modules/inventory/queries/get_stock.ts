import { db } from "#app/config/database.ts";
import { sql } from "kysely";

export const get_inventory_by_date = async (store: string, date: string) => {
  const inventory = await db
    .selectFrom("inv_stock")
    .where("warehouse_id", "=", store)
    .where(sql`DATE(stock_at)`, "=", date)
    .selectAll()
    .execute();

  return inventory;
};
