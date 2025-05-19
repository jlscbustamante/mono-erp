import { db } from "#app/config/database.ts";
import { clear_cache } from "#app/modules/inventory/case/clear_cache_stock.ts";
import { Dispatch, IDispatch } from "#app/modules/inventory/case/dispatch.ts";
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchCreateDto,
  InvDispatchItemInsert,
} from "@scope/shared";
import { parseISO } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";

export class DispatchExceptional extends Dispatch {
  constructor() {
    super();
  }

  /**
   *
   * @deprecated Usa un dto anterior
   */
  async execute(data: DispatchCreateDto, username: string) {
    const items_dispatch: IDispatch[] = [];
    if (data.items.length == 0) {
      throw new HTTPException(400, {
        message: `No se encontraron items para despachar`,
      });
    }

    data.items.forEach((item) => {
      items_dispatch.push({
        item_id: item.itemId,
        item_name: item.itemName,
        dispatch_id: 0,
        dispatch_at: parseISO(data.dispatchAt),
        // presentation_id: item.presentationId,
        // presentation_name: item.presentationName,
        type: DISPATCH_MOVE_TYPE.EXCEPTIONAL,
        status: 3,
        warehouse_from: data.wareFromId,
        warehouse_to: data.wareToId,
        quantity: item.quantity,
        unit_value: item.unitValue,
        total_value: item.totalValue,
        measure_id: item.measureId,
      });
    });

    const warehouse_from_code = data.wareFromId;
    const warehouse_to_code = data.wareToId;
    if (!warehouse_from_code) {
      throw new HTTPException(400, {
        message: `No se encontró el almacén de origen`,
      });
    }
    if (!warehouse_to_code) {
      throw new HTTPException(400, {
        message: `No se encontró el almacén de destino`,
      });
    }

    const { store_from, store_to } = await this.get_involved_stores(
      warehouse_from_code,
      warehouse_to_code
    );

    const _stock_from = await this.get_stock(
      store_from,
      items_dispatch,
      data.dispatchAt,
      "out",
      username
    );
    const _stock_to = await this.get_stock(
      store_to,
      items_dispatch,
      data.dispatchAt,
      "in",
      username
    );

    const stock_from = this.clear_stock(_stock_from);
    const stock_to = this.clear_stock(_stock_to);

    const items_to_insert: InvDispatchItemInsert[] = items_dispatch.map(
      (el) => {
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
      }
    );

    const total = items_dispatch.reduce(
      (acc, el) => acc + (el.total_value ? +el.total_value : 0),
      0
    );

    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("inv_stock")
        .where("warehouse_id", "in", [store_from.id, store_to.id])
        .where(sql`DATE(stock_at)`, "=", data.dispatchAt)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("inv_stock")
        .values([...stock_from, ...stock_to])
        .executeTakeFirstOrThrow();

      const result = await trx
        .insertInto("inv_dispatch")
        .values({
          status: DISPATCH_STATUS.DISPATCHED,
          move_type: DISPATCH_MOVE_TYPE.EXCEPTIONAL,
          move_at: parseISO(data.dispatchAt),
          sucursal_from_id: store_from.id,
          sucursal_to_id: store_to.id,
          approved_by: username,
          total_value: total.toString(),
          net_value: total.toString(),
          gloss: data.gloss ?? "",
          num_guide: data.numGuide ?? "",
          num_invoice: data.numInvoice ?? "",
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
          items_to_insert.map((el) => ({
            ...el,
            dispatch_id: Number(dispatch_id),
          }))
        )
        .executeTakeFirstOrThrow();
    });

    clear_cache(warehouse_from_code, data.dispatchAt);
    clear_cache(warehouse_to_code, data.dispatchAt);
  }
}
