import { db } from "#app/config/database.ts";
import { get_items } from "./get_items.ts";

export const get_template = async (template_id: string) => {
  const items = await get_items();
  const template = await db
    .selectFrom("inv_dispatchbase")
    .where("sucursal_type", "=", template_id)
    .innerJoin(
      "inv_dispatchbase_item",
      "inv_dispatchbase_item.dispatch_id",
      "inv_dispatchbase.id"
    )
    .selectAll()
    .execute();

  return template;
};
