import { db } from "#app/config/database.ts";
import { Dispatch } from "#app/modules/inventory/case/dispatch.ts";
import {
  DISPATCH_STATUS,
  DispatchUpdateDto,
  InvDispatchItemInsert,
} from "@scope/shared";
import { Queue, Worker } from "bullmq";
import { HTTPException } from "hono/http-exception";
import { sql } from "kysely";

const dispatchQueue = new Queue("dispatch_queue");

new Worker(
  "dispatch_queue",
  async (job: any) => {
    const { dispatch_id, date, username, warheouse_origin } = job.data;
    const dispatchOrder = new DispatchOrderById();
    await dispatchOrder.execute(dispatch_id, date, username, warheouse_origin);
  },
  {
    connection: {},
    concurrency: 1,
  }
);

export const dispatch_multiple = (
  ids: number[],
  date: string,
  username: string,
  warehouse_origin?: string
) => {
  for (const id of ids) {
    dispatchQueue.add(
      "dispatch_order",
      {
        dispatch_id: id,
        date,
        username,
        warehouse_origin,
      },
      {
        attempts: 0,
      }
    );
  }
};

export const check_status = async () => {
  const waitingJob = await dispatchQueue.getWaiting();
  const activeJobs = await dispatchQueue.getActive();
  const delayedJobs = await dispatchQueue.getDelayed();
  const failedJobs = await dispatchQueue.getFailed();

  if (
    waitingJob.length === 0 &&
    activeJobs.length === 0 &&
    delayedJobs.length === 0 &&
    failedJobs.length === 0
  ) {
    await clear_logs();
  }

  return {
    waiting: waitingJob.length,
    active: activeJobs.length,
    delayed: delayedJobs.length,
    failed: failedJobs.length,
    failed_details: failedJobs.map((el) => ({
      dispatch_id: el.data.dispatch_id,
      error: el.failedReason,
    })),
  };
};

export const stop_queue = async () => {
  await dispatchQueue.pause();
};

export const clear_logs = async () => {
  await dispatchQueue.clean(0, 0, "completed");
  await dispatchQueue.clean(0, 0, "failed");
  await dispatchQueue.clean(0, 0, "delayed");
};

export class DispatchOrderById extends Dispatch {
  constructor() {
    super();
  }

  async execute(
    dispatch_id: number,
    date: string,
    username: string,
    warehouse_origin?: string
  ) {
    const items_dispatch = await this.get_dispatch(dispatch_id);
    this.validate_data(items_dispatch);

    const warehouse_from_code =
      warehouse_origin ?? items_dispatch[0].warehouse_from;
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
    const _stock_from = await this.get_stock(
      store_from,
      items_dispatch,
      date,
      "out",
      username
    );
    const _stock_to = await this.get_stock(
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
          status: DISPATCH_STATUS.DISPATCHED,
          approved_by: username,
          sucursal_from_id: store_from.id,
        })
        .where("id", "=", dispatch_id)
        .executeTakeFirstOrThrow();
    });
  }

  /**
   * @deprecated Este metodo sigue usando un dto anterior
   */
  async execute_and_update(data: DispatchUpdateDto, username: string) {
    let items_dispatch = await this.get_dispatch(data.id);

    items_dispatch = items_dispatch.map((item) => {
      const item_data = data.items.find((el) => el.itemId == item.item_id);
      const quantity = item_data?.quantity
        ? item_data.quantity.toString()
        : item.quantity;
      const total =
        (item.unit_value ? +item.unit_value : 0) * (quantity ? +quantity : 0);

      return {
        ...item,
        quantity,
        total_value: total.toString(),
        warehouse_from: data.wareFromId,
        warehouse_to: data.wareToId,
      };
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

    const item_to_insert: InvDispatchItemInsert[] = items_dispatch.map((el) => {
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

      await trx
        .updateTable("inv_dispatch")
        .set({
          status: DISPATCH_STATUS.DISPATCHED,
          approved_by: username,
          sucursal_from_id: store_from.id,
          gloss: data.gloss ?? "",
          total_value: total.toString(),
          net_value: total.toString(),
        })
        .where("id", "=", data.id)
        .executeTakeFirstOrThrow();

      await trx
        .deleteFrom("inv_dispatch_item")
        .where("dispatch_id", "=", data.id)
        .executeTakeFirstOrThrow();
      await trx
        .insertInto("inv_dispatch_item")
        .values(item_to_insert)
        .executeTakeFirstOrThrow();
    });
  }
}
