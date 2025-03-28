import { db } from "#app/config/database.ts";

export const get_equivalence = async (template_id: string) => {
  // const templateDb = await db.sele;
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
