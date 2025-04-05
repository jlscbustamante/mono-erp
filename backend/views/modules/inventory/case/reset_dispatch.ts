import { db } from "#app/config/database.ts";
import { Dispatch } from "#app/modules/inventory/case/dispatch.ts";
import { DISPATCH_STATUS, InvDispatchItemSelect } from "@scope/shared";
import { format } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";

interface IDispatch extends InvDispatchItemSelect {
  warehouse_from: string | null;
  warehouse_to: string | null;
  status: number;
  dispatch_at: Date;
}

export class ResetDispatch extends Dispatch {
  constructor() {
    super();
  }

  async execute(dispatch_id: number, username: string) {
    const items_dispatch = await this.get_dispatch(dispatch_id);
    if (!items_dispatch.length) {
      throw new Error("No se encontró el despacho");
    }
    const date = format(items_dispatch[0].dispatch_at, "yyyy-MM-dd");
    const status = items_dispatch[0].status;
    if (status != DISPATCH_STATUS.DISPATCHED) {
      throw new HTTPException(400, {
        message: `El despacho no tiene el estado correcto(despachado)`,
      });
    }

    const warehouse_from_code = items_dispatch[0].warehouse_from;
    if (!warehouse_from_code) {
      throw new HTTPException(400, {
        message: `No se encontró el almacén de origen`,
      });
    }
    const warehouse_to_code = items_dispatch[0].warehouse_to;
    if (!warehouse_to_code) {
      throw new HTTPException(400, {
        message: `No se encontró el almacén de destino`,
      });
    }
    const { store_from, store_to } = await this.get_involved_stores(
      warehouse_from_code,
      warehouse_to_code
    );

    const _stock_from = await this.get_stock_reset(
      store_from,
      items_dispatch,
      date,
      "out",
      username
    );
    const _stock_to = await this.get_stock_reset(
      store_to,
      items_dispatch,
      date,
      "in",
      username
    );
    const stock_from = this.clear_stock(_stock_from);
    const stock_to = this.clear_stock(_stock_to);

    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("inv_stock")
        .where("warehouse_id", "in", [store_from.id, store_to.id])
        .where(sql`DATE(stock_at)`, "=", date)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("inv_stock")
        .values([...stock_from, ...stock_to])
        .executeTakeFirstOrThrow();

      await trx
        .updateTable("inv_dispatch")
        .set({
          status: DISPATCH_STATUS.NEW,
          approved_by: username,
          sucursal_from_id: store_from.id,
        })
        .where("id", "=", dispatch_id)
        .executeTakeFirstOrThrow();
    });
  }
}
