import { db } from "#app/config/database.ts";
import { redis } from "#app/config/redis.ts";
import { IItemTemplate } from "#app/modules/inventory/dto/item_template.dto.ts";
import { get_equivalencies } from "#app/modules/inventory/queries/get_equivalences.ts";
import { minutesToSeconds } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { ITemplate } from "../../../../shared/types/index.ts";
import { get_items } from "./get_items.ts";

export const get_items_template = async (
  template_id: string
): Promise<IItemTemplate[]> => {
  const items_template = await db
    .selectFrom("inv_dispatchbase")
    .where("sucursal_type", "=", template_id)
    .innerJoin(
      "inv_dispatchbase_item",
      "inv_dispatchbase_item.dispatch_id",
      "inv_dispatchbase.id"
    )
    .selectAll()
    .execute();
  return items_template;
};

export const get_template = async (
  template_id: string
): Promise<ITemplate[]> => {
  const cache = await redis.get(`erp:template:${template_id}`);
  if (cache) {
    return JSON.parse(cache) as ITemplate[];
  }
  const equivalencies = await get_equivalencies();
  const items = await get_items();

  const items_template = await get_items_template(template_id);

  const template: ITemplate[] = [];
  for (const item of items_template) {
    const item_stock = items.find((i) => i.item_id == item.item_stock_id);
    const item_dispatch = items.find((i) => i.item_id == item.item_move_id);
    if (!item_stock)
      throw new HTTPException(400, {
        message: `No se encontró el item ${item.item_stock_id} de la plantilla ${template_id}`,
      });
    if (!item_dispatch)
      throw new HTTPException(400, {
        message: "No se encontró el item de despacho en el template",
      });

    if (item_stock.item_id == item_dispatch.item_id) {
      const item_template: ITemplate = {
        item_dispatch,
        item_stock,
        equivalency: null,
      };
      template.push(item_template);
    } else {
      const equivalency = equivalencies.find(
        (e) =>
          (e.presentation_from == item_stock.presentation_id &&
            e.measure_to == item_dispatch.presentation_id) ||
          (e.presentation_from == item_dispatch.presentation_id &&
            e.measure_to == item_stock.presentation_id)
      );

      if (!equivalency)
        throw new HTTPException(400, {
          message:
            "No se encontró la equivalencia entre los items : " +
            `${item_stock.item_name} y ${item_dispatch.item_name}`,
        });

      const item_template: ITemplate = {
        item_stock,
        item_dispatch,
        equivalency,
      };
      template.push(item_template);
    }
  }

  await redis.set(
    `erp:template:${template_id}`,
    JSON.stringify(template),
    "EX",
    minutesToSeconds(60 * 5)
  );
  return template;
};
