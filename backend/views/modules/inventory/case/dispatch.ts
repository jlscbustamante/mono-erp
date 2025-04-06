import { db } from "#app/config/database.ts";
import { generate_stock_report } from "#app/modules/inventory/queries/get_stock.ts";
import { get_template } from "#app/modules/inventory/queries/get_template.ts";
import { get_stores } from "#app/modules/sucursales/queries/get_stores.ts";
import {
  AdmSucursalSelect,
  InvDispatchItemInsert,
  InvStockSelectOptionalId,
  SUCURSAL_TYPE,
} from "@scope/shared";
import { HTTPException } from "hono/http-exception";

export interface IDispatch extends InvDispatchItemInsert {
  warehouse_from: string | null;
  warehouse_to: string | null;
  dispatch_at: Date;
  status: number;
  type: string;
}

export abstract class Dispatch {
  protected async get_stock(
    warehouse: AdmSucursalSelect,
    dispatch_items: IDispatch[],
    date: string,
    dir: "in" | "out" = "out",
    user: string = "sys"
  ): Promise<InvStockSelectOptionalId[]> {
    if (!warehouse.guide_template)
      throw new HTTPException(400, {
        message: `El almacén ${warehouse.title} no tiene plantilla de despacho`,
      });
    const template = await get_template(warehouse.guide_template);

    const unmatched_dispatch_item = dispatch_items.find(
      (el) => !template.some((item) => item.item_dispatch.item_id == el.item_id)
    );

    if (unmatched_dispatch_item) {
      throw new HTTPException(400, {
        message: `El item ${unmatched_dispatch_item.item_id}-${unmatched_dispatch_item.item_name} no esta en la plantilla`,
      });
    }

    const stock = await generate_stock_report(
      warehouse.id,
      date,
      warehouse.guide_template,
      warehouse.type_sede
        ? (warehouse.type_sede as SUCURSAL_TYPE)
        : SUCURSAL_TYPE.STORE
    );

    const relation: Record<number, number> = {};
    for (const item_dispatched of dispatch_items) {
      const quantity = item_dispatched.quantity
        ? +item_dispatched.quantity
        : null;
      if (quantity == null || quantity <= 0) {
        throw new HTTPException(400, {
          message: `La cantidad del item ${item_dispatched.item_id}-${item_dispatched.item_name} no es válida`,
        });
      }
      const template_item = template.find(
        (item) => item.item_dispatch.item_id == item_dispatched.item_id
      );
      if (template_item) {
        let new_dispatch_quantity = 0;
        if (template_item.equivalency == null) {
          new_dispatch_quantity = quantity;
        } else {
          if (
            // aunque es measure_to, se refiere a presentacion
            template_item.item_dispatch.presentation_id ==
            template_item.equivalency.measure_to
          ) {
            // de derecha a izquierda, cantidad * valor /factor
            new_dispatch_quantity =
              (+template_item.equivalency.value_from * quantity) /
              +template_item.equivalency.value_factor;
          } else {
            // de izquierda a derecha (default)
            new_dispatch_quantity =
              (+template_item.equivalency.value_factor * quantity) /
              +template_item.equivalency.value_from;
          }
        }
        relation[item_dispatched.item_id] = new_dispatch_quantity;
      }
    }

    const stock_modified = stock.map((item) => {
      const quantity_dispatched = relation[item.item_id];
      if (!quantity_dispatched) return item;

      let quantity_in_dp = +item.quantity_in_dp;
      let quantity_out_dp = +item.quantity_out_dp;
      let current = +item.stock_current;
      if (warehouse.type_sede == SUCURSAL_TYPE.WAREHOUSE) {
        if (dir == "in") {
          quantity_in_dp += quantity_dispatched;
          current += quantity_dispatched;
        } else {
          quantity_out_dp += quantity_dispatched;
          current -= quantity_dispatched;
        }
      } else {
        if (dir == "in") {
          quantity_in_dp += quantity_dispatched;
          current += quantity_dispatched;
        } else {
          quantity_out_dp += quantity_dispatched;
          current -= quantity_dispatched;
        }
      }
      return {
        ...item,
        quantity_in_dp: quantity_in_dp.toString(),
        quantity_out_dp: quantity_out_dp.toString(),
        created_by: user,
        stock_current: current.toString(),
      };
    });

    return stock_modified;
  }

  protected async get_stock_reset(
    warehouse: AdmSucursalSelect,
    dispatch_items: IDispatch[],
    date: string,
    dir: "in" | "out" = "out",
    user: string = "sys"
  ): Promise<InvStockSelectOptionalId[]> {
    if (!warehouse.guide_template)
      throw new HTTPException(400, {
        message: `El almacén ${warehouse.title} no tiene plantilla de despacho`,
      });
    const template = await get_template(warehouse.guide_template);

    const unmatched_dispatch_item = dispatch_items.find(
      (el) => !template.some((item) => item.item_dispatch.item_id == el.item_id)
    );

    if (unmatched_dispatch_item) {
      throw new HTTPException(400, {
        message: `El item ${unmatched_dispatch_item.item_id}-${unmatched_dispatch_item.item_name} no esta en la plantilla`,
      });
    }

    const stock = await generate_stock_report(
      warehouse.id,
      date,
      warehouse.guide_template,
      warehouse.type_sede
        ? (warehouse.type_sede as SUCURSAL_TYPE)
        : SUCURSAL_TYPE.STORE
    );

    const relation: Record<number, number> = {};
    for (const item_dispatched of dispatch_items) {
      const quantity = item_dispatched.quantity
        ? +item_dispatched.quantity
        : null;
      if (quantity == null || quantity <= 0) {
        throw new HTTPException(400, {
          message: `La cantidad del item ${item_dispatched.item_id}-${item_dispatched.item_name} no es válida`,
        });
      }
      const template_item = template.find(
        (item) => item.item_dispatch.item_id == item_dispatched.item_id
      );
      if (template_item) {
        let new_dispatch_quantity = 0;
        if (template_item.equivalency == null) {
          new_dispatch_quantity = quantity;
        } else {
          if (
            // aunque es measure_to, se refiere a presentacion
            template_item.item_dispatch.presentation_id ==
            template_item.equivalency.measure_to
          ) {
            // de derecha a izquierda, cantidad * valor /factor
            new_dispatch_quantity =
              (+template_item.equivalency.value_from * quantity) /
              +template_item.equivalency.value_factor;
          } else {
            // de izquierda a derecha (default)
            new_dispatch_quantity =
              (+template_item.equivalency.value_factor * quantity) /
              +template_item.equivalency.value_from;
          }
        }
        relation[item_dispatched.item_id] = new_dispatch_quantity;
      }
    }

    const stock_modified = stock.map((item) => {
      const quantity_dispatched = relation[item.item_id];
      if (!quantity_dispatched) return item;

      let quantity_in_dp = +item.quantity_in_dp;
      let quantity_out_dp = +item.quantity_out_dp;
      let current = +item.stock_current;
      if (warehouse.type_sede == SUCURSAL_TYPE.WAREHOUSE) {
        if (dir == "in") {
          quantity_in_dp -= quantity_dispatched;
          current -= quantity_dispatched;
        } else {
          quantity_out_dp -= quantity_dispatched;
          current += quantity_dispatched;
        }
      } else {
        if (dir == "in") {
          quantity_in_dp -= quantity_dispatched;
          current -= quantity_dispatched;
        } else {
          quantity_out_dp -= quantity_dispatched;
          current += quantity_dispatched;
        }
      }

      return {
        ...item,
        quantity_in_dp: quantity_in_dp.toString(),
        quantity_out_dp: quantity_out_dp.toString(),
        created_by: user,
        stock_current: current.toString(),
      };
    });

    return stock_modified;
  }

  protected clear_stock(
    stock: InvStockSelectOptionalId[]
  ): InvStockSelectOptionalId[] {
    const filtered = stock.filter((el) => {
      const qid = el.quantity_in_dp ? +el.quantity_in_dp : 0;
      const qod = el.quantity_out_dp ? +el.quantity_out_dp : 0;
      const qim = el.quantity_in_mv ? +el.quantity_in_mv : 0;
      const qom = el.quantity_out_mv ? +el.quantity_out_mv : 0;
      const qos = el.quantity_out_sl ? +el.quantity_out_sl : 0;
      const qip = el.quantity_in_pu ? +el.quantity_in_pu : 0;
      const current = el.stock_current ? +el.stock_current : 0;
      const physical = el.stock_physical ? +el.stock_physical : 0;
      const last = el.stock_last ? +el.stock_last : 0;
      const sum = qid + qod + qim + qom + qos + qip + current + physical + last;
      return sum > 0;
    });

    return filtered.length == 0 ? [stock[0]] : filtered;
  }

  protected async get_dispatch(id: number): Promise<IDispatch[]> {
    const items_dispatch: IDispatch[] = await db
      .selectFrom("inv_dispatch")
      .innerJoin(
        "inv_dispatch_item as idi",
        "idi.dispatch_id",
        "inv_dispatch.id"
      )
      .selectAll("idi")
      .select([
        "inv_dispatch.sucursal_from_id as warehouse_from",
        "inv_dispatch.sucursal_to_id as warehouse_to",
        "inv_dispatch.move_at as dispatch_at",
        "inv_dispatch.status as status",
        "inv_dispatch.move_type as type",
      ])
      .where("inv_dispatch.id", "=", id)
      .execute();
    return items_dispatch;
  }

  protected async get_involved_stores(
    code_from: string,
    code_to: string
  ): Promise<{
    store_from: AdmSucursalSelect;
    store_to: AdmSucursalSelect;
  }> {
    const stores = await get_stores();
    const store_from = stores.find((store) => store.id == code_from);
    const store_to = stores.find((store) => store.id == code_to);

    if (!store_from || !store_to) {
      throw new HTTPException(400, {
        message: "No se encontró la tienda de origen o destino",
      });
    }

    if (!store_from.company_id || !store_to.company_id) {
      throw new HTTPException(400, {
        message: "El campo compañia es obligatorio",
      });
    }

    return { store_from, store_to };
  }

  protected validate_data(data: IDispatch[]) {
    if (!data || data.length == 0) {
      throw new HTTPException(400, {
        message: "No se encontraron items para el despacho",
      });
    }

    const itemIds = data.map((item) => item.item_id);
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
