import { get_template } from "#app/modules/inventory/queries/get_template.ts";
import { get_stores } from "#app/modules/sucursales/queries/get_stores.ts";
import { DispatchUpdateDto } from "@scope/shared";
import { format } from "date-fns";
import { HTTPException } from "hono/http-exception";

export class DispatchOrder {
  async execute(data: DispatchUpdateDto, username: string) {
    this.validate_data(data);
    const stores = await get_stores();
    const store_from = stores.find((store) => store.id == data.wareFromId);
    const store_to = stores.find((store) => store.id == data.wareToId);
    if (!store_from || !store_to) {
      throw new HTTPException(400, {
        message: "No se encontró la tienda de origen o destino",
      });
    }

    if (!store_from.trademark_id || !store_to.trademark_id) {
      throw new HTTPException(400, {
        message: "El campo compañia es obligatorio",
      });
    }

    const [template_from, template_to] = await Promise.all([
      get_template(store_from.trademark_id),
      get_template(store_to.trademark_id),
    ]);

    return template_from;
  }

  private validate_data(data: DispatchUpdateDto) {
    const today = format(new Date(), "yyyy-MM-dd");
    const dispatch_date = data.dispatchAt?.split(" ")[0];

    if (dispatch_date > today) {
      throw new HTTPException(400, {
        message: "La fecha de despacho no puede ser mayor a hoy",
      });
    }

    if (data.items.length == 0) {
      throw new HTTPException(400, {
        message: "No se puede despachar sin items",
      });
    }

    if (!data.wareFromId || !data.wareToId) {
      throw new HTTPException(400, {
        message: "No se puede despachar sin un origen y destino",
      });
    }

    const itemIds = data.items.map((item) => item.id);
    const duplicateIds = itemIds.filter(
      (id, index) => itemIds.indexOf(id) !== index
    );

    if (duplicateIds.length > 0) {
      throw new HTTPException(400, {
        message: `Los siguientes items están duplicados: ${[
          ...new Set(duplicateIds),
        ].join(", ")}`,
      });
    }
  }
}
