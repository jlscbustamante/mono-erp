import { db } from "#app/config/database.ts";
import { Dispatch } from "#app/modules/inventory/case/dispatch.ts";
import { DISPATCH_STATUS } from "@scope/shared";
import { format } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";

export class DeleteDispatch extends Dispatch {
  constructor() {
    super();
  }

  async execute(dispatch_id: number, username: string, reason?: string) {
    const dispatch_list = await db
      .selectFrom("inv_dispatch")
      .select(["num_invoice", "status"])
      .where("id", "=", dispatch_id)
      .execute();
    if (dispatch_list.length == 0)
      throw new HTTPException(400, {
        message: `No se encontró el despacho`,
      });
    const dispatch = dispatch_list[0];

    const items_dispatch = await this.get_dispatch(dispatch_id);
    if (!items_dispatch.length) {
      throw new Error("No se encontró el despacho");
    }
    const date = format(items_dispatch[0].dispatch_at, "yyyy-MM-dd");
    const status = dispatch.status;

    if (status != DISPATCH_STATUS.NEW && status != DISPATCH_STATUS.INVOICED) {
      throw new HTTPException(400, {
        message: `El despacho no tiene el estado correcto`,
      });
    }

    if (status == DISPATCH_STATUS.NEW) {
      await db
        .updateTable("inv_dispatch")
        .set({
          status: DISPATCH_STATUS.CANCELLED,
          approved_by: username,
        })
        .where("id", "=", dispatch_id)
        .executeTakeFirstOrThrow();
      return;
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

    if (status == DISPATCH_STATUS.INVOICED) {
      if (!dispatch.num_invoice)
        throw new HTTPException(400, {
          message: `No se encontró la factura en el despacho`,
        });
      if (!reason)
        throw new HTTPException(400, {
          message: `Para anular el despacho facturado, debe indicar el motivo`,
        });

      await cancelInvoice(dispatch.num_invoice, reason);
    }

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
          status: DISPATCH_STATUS.CANCELLED,
          approved_by: username,
          sucursal_from_id: store_from.id,
        })
        .where("id", "=", dispatch_id)
        .executeTakeFirstOrThrow();
    });
  }
}

async function cancelInvoice(invoice: string, reason: string) {
  const request = await fetch(
    "https://facturacion.pizzaraul.com/api/documentSunatVoided",
    {
      method: "POST",
      body: JSON.stringify({
        source: "ERP",
        order_id: invoice,
        motivo: reason,
      }),
    }
  );

  if (!request.ok) throw new Error("No se puede cancelar la factura");
}
