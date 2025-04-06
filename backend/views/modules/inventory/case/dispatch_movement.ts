import { db } from "#app/config/database.ts";
import { Dispatch } from "#app/modules/inventory/case/dispatch.ts";
import { get_items } from "#app/modules/inventory/queries/get_items.ts";
import { generate_stock_report } from "#app/modules/inventory/queries/get_stock.ts";
import { get_stores } from "#app/modules/sucursales/queries/get_stores.ts";
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  InvDispatchItemInsert,
  InvStockSelectOptionalId,
  MoveBetweenStoresDto,
  SUCURSAL_TYPE,
} from "@scope/shared";
import { parseISO } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";

/**
 * @description Despacho entre tiendas
 */
export class DispatchMovement extends Dispatch {
  constructor() {
    super();
  }

  async execute(data: MoveBetweenStoresDto, username: string) {
    if (data.items.length == 0)
      throw new HTTPException(400, {
        message: `No se encontraron items para despachar`,
      });
    const stores = await get_stores();
    const store_from = stores.find((store) => store.id == data.storeFrom);
    const store_to = stores.find((store) => store.id == data.storeToId);
    if (!store_from && !store_to) {
      throw new HTTPException(400, {
        message: `No se encontró la tienda de origen o destino`,
      });
    }
    if (store_from && !store_from.guide_template)
      throw new HTTPException(400, {
        message: `La tienda de origen no tiene plantilla_id definida`,
      });
    if (store_to && !store_to.guide_template)
      throw new HTTPException(400, {
        message: `La tienda de destino no tiene plantilla_id definida`,
      });

    const [stock_from, stock_to] = await Promise.all([
      store_from
        ? generate_stock_report(
            store_from.id,
            data.moveAt,
            store_from.guide_template!,
            SUCURSAL_TYPE.STORE
          )
        : undefined,
      store_to
        ? generate_stock_report(
            store_to.id,
            data.moveAt,
            store_to.guide_template!,
            SUCURSAL_TYPE.STORE
          )
        : undefined,
    ]);

    if (stock_from) {
      const items_not_found = data.items.filter(
        (item) => !stock_from.find((stock) => stock.item_id == item.itemId)
      );
      if (items_not_found.length > 0) {
        throw new HTTPException(400, {
          message: `No se encontraron los siguientes items en la tienda de origen: ${items_not_found
            .map((item) => item.itemId)
            .join(", ")}`,
        });
      }
    }
    if (stock_to) {
      const items_not_found = data.items.filter(
        (item) => !stock_to.find((stock) => stock.item_id == item.itemId)
      );
      if (items_not_found.length > 0) {
        throw new HTTPException(400, {
          message: `No se encontraron los siguientes items en la tienda de destino: ${items_not_found
            .map((item) => item.itemId)
            .join(", ")}`,
        });
      }
    }
    const stock_from_modified = stock_from?.map((item) => {
      const item_dispatch = data.items.find((i) => i.itemId == item.item_id);
      if (!item_dispatch) return item;
      const quantity_out_mv = +item.quantity_out_mv + +item_dispatch.quantity;
      const current = +item.stock_current - +item_dispatch.quantity;
      return {
        ...item,
        id: undefined,
        quantity_out_mv: quantity_out_mv.toString(),
        stock_current: current.toString(),
      };
    });
    const stock_to_modified = stock_to?.map((item) => {
      const item_dispatch = data.items.find((i) => i.itemId == item.item_id);
      if (!item_dispatch) return item;
      const quantity_in_mv = +item.quantity_in_mv + +item_dispatch.quantity;
      const current = +item.stock_current + +item_dispatch.quantity;
      return {
        ...item,
        id: undefined,
        quantity_in_mv: quantity_in_mv.toString(),
        stock_current: current.toString(),
      };
    });

    const stock_from_cleaned = stock_from_modified
      ? this.clear_stock(stock_from_modified)
      : undefined;
    const stock_to_cleaned = stock_to_modified
      ? this.clear_stock(stock_to_modified)
      : undefined;

    const items = await get_items();
    const items_dispatch_to_insert: InvDispatchItemInsert[] = data.items.map(
      (item) => {
        const item_data = items.find((i) => i.item_id == item.itemId);

        if (item_data) {
          const total = +item_data.store_price * item.quantity;
          return {
            item_id: item_data.item_id,
            dispatch_id: 0,
            item_name: item_data.item_name,
            presentation_id: item_data.presentation_id,
            presentation_name: item_data.presentation_name,
            unit_value: item_data.store_price,
            measure_id: item_data.product_measure_id,
            quantity: item.quantity,
            total_value: total,
          } satisfies InvDispatchItemInsert;
        } else {
          throw new HTTPException(400, {
            message: `No se encontró el item ${item.itemId}`,
          });
        }
      }
    );
    const total = items_dispatch_to_insert.reduce(
      (acc, el) => acc + (el.total_value ? +el.total_value : 0),
      0
    );

    await db.transaction().execute(async (trx) => {
      const stores_ids: string[] = [];
      const items_to_insert: InvStockSelectOptionalId[] = [];
      if (store_from && stock_from_cleaned) {
        stores_ids.push(store_from.id);
        items_to_insert.push(...stock_from_cleaned);
      }
      if (store_to && stock_to_cleaned) {
        stores_ids.push(store_to.id);
        items_to_insert.push(...stock_to_cleaned);
      }
      await trx
        .deleteFrom("inv_stock")
        .where("warehouse_id", "in", stores_ids)
        .where(sql`DATE(stock_at)`, "=", data.moveAt)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("inv_stock")
        .values(items_to_insert)
        .executeTakeFirstOrThrow();

      const result = await trx
        .insertInto("inv_dispatch")
        .values({
          status: DISPATCH_STATUS.DISPATCHED,
          move_type: DISPATCH_MOVE_TYPE.STORE_TO_STORE,
          approved_by: username,
          sucursal_from_id: store_from?.id ?? "",
          sucursal_to_id: store_to?.id ?? "",
          move_at: parseISO(data.moveAt),
          gloss: data.gloss ?? "",
          total_value: total.toString(),
          net_value: total.toString(),
          tax_value: "0",
        })
        .executeTakeFirstOrThrow();
      const dispatch_id = result.insertId;
      if (!dispatch_id) {
        throw new HTTPException(400, {
          message: `No se pudo crear el despacho`,
        });
      }
      await trx
        .insertInto("inv_dispatch_item")
        .values(
          items_dispatch_to_insert.map((el) => ({
            ...el,
            dispatch_id: Number(dispatch_id),
          }))
        )
        .executeTakeFirstOrThrow();
    });
  }
}
