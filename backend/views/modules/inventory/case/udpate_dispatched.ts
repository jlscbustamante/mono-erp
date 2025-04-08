import { db } from "#app/config/database.ts";
import { get_items } from "#app/modules/inventory/queries/get_items.ts";
import { get_stores } from "#app/modules/sucursales/queries/get_stores.ts";
import {
  DISPATCH_STATUS,
  DispatchItem,
  DispatchItemAddDto,
  InvDispatchItemInsert,
} from "@scope/shared";
import { format } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";
import { Dispatch } from "./dispatch.ts";

export class UpdateDispatched extends Dispatch {
  async execute(
    data: {
      dispatch_id: number;
      to_create: DispatchItemAddDto[];
      to_update: DispatchItem[];
      to_delete: DispatchItem[];
      tax_value: number;
    },
    username: string
  ) {
    const stores = await get_stores();
    const items = await get_items();
    const items_dispatch = await this.get_dispatch(data.dispatch_id);

    if (items_dispatch.length == 0) {
      throw new HTTPException(400, {
        message: "No se encontraron items para actualizar",
      });
    }
    const status = items_dispatch[0].status;
    const warehouse_from = items_dispatch[0].warehouse_from;
    const warehouse_to = items_dispatch[0].warehouse_to;
    const store_from = stores.find((el) => el.id == warehouse_from);
    const store_to = stores.find((el) => el.id == warehouse_to);

    if (!store_from || !store_to) {
      throw new HTTPException(400, {
        message: "No se encontraron almacenes para actualizar",
      });
    }

    const dispatch_at = items_dispatch[0].dispatch_at;
    const type = items_dispatch[0].type;

    let items_modified = items_dispatch.map((el) => {
      const modified = data.to_update.find((item) => item.id == el.id);
      if (modified) {
        const quantity = modified.quantity;
        const unit_value = el.unit_value ? +el.unit_value : modified.unitValue;
        const total = quantity * unit_value;

        return {
          ...el,
          quantity,
          total_value: total.toString(),
        };
      }
      return el;
    });
    items_modified = items_modified.filter(
      (el) => !data.to_delete.find((item) => item.itemId == el.item_id)
    );
    for (const item_create of data.to_create) {
      const item = items.find((el) => el.item_id == item_create.itemId);
      if (!item) {
        throw new Error(
          `El item con id ${item_create.itemId} no fue encontrado para agregarlo`
        );
      }

      items_modified.push({
        dispatch_at,
        warehouse_from,
        warehouse_to,
        status,
        type,
        item_id: item.item_id,
        item_name: item.item_name,
        dispatch_id: data.dispatch_id,
        presentation_id: item.presentation_id,
        presentation_name: item.presentation_name,
        quantity: item_create.quantity,
        unit_value: item.store_price,
        measure_id: item.product_measure_id,
      });
    }
    const _stock_from = await this.get_stock_reset(
      store_from,
      items_dispatch,
      format(dispatch_at, "yyyy-MM-dd"),
      "out",
      username
    );
    const _stock_to = await this.get_stock_reset(
      store_to,
      items_dispatch,
      format(dispatch_at, "yyyy-MM-dd"),
      "in",
      username
    );

    const stock_from = await this.get_stock(
      store_from,
      items_modified,
      format(dispatch_at, "yyyy-MM-dd"),
      "out",
      username,
      _stock_from
    );
    const stock_to = await this.get_stock(
      store_to,
      items_modified,
      format(dispatch_at, "yyyy-MM-dd"),
      "in",
      username,
      _stock_to
    );
    const stock_from_cleaned = this.clear_stock(stock_from);
    const stock_to_cleaned = this.clear_stock(stock_to);

    const item_to_insert: InvDispatchItemInsert[] = items_modified.map((el) => {
      const {
        warehouse_from: _1,
        warehouse_to: _2,
        dispatch_at: _3,
        status: _4,
        type: _5,
        id: _6,
        ...rest
      } = el;
      return rest;
    });
    const total = item_to_insert.reduce(
      (acc, el) => acc + (el.total_value ? +el.total_value : 0),
      0
    );

    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("inv_stock")
        .where("warehouse_id", "in", [store_from.id, store_to.id])
        .where(sql`DATE(stock_at)`, "=", dispatch_at)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("inv_stock")
        .values([...stock_from_cleaned, ...stock_to_cleaned])
        .executeTakeFirstOrThrow();

      await trx
        .updateTable("inv_dispatch")
        .set({
          status: DISPATCH_STATUS.DISPATCHED,
          approved_by: username,
          sucursal_from_id: store_from.id,
          total_value: (total + data.tax_value).toString(),
          tax_value: data.tax_value.toString(),
          net_value: total.toString(),
        })
        .where("id", "=", data.dispatch_id)
        .executeTakeFirstOrThrow();

      await trx
        .deleteFrom("inv_dispatch_item")
        .where("dispatch_id", "=", data.dispatch_id)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("inv_dispatch_item")
        .values(item_to_insert)
        .executeTakeFirstOrThrow();
    });
  }
}
