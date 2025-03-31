import { db } from "#app/config/database.ts";
import { PARAMETER } from "#app/const/index.ts";
import { get_inventory_by_date } from "#app/modules/inventory/queries/get_stock.ts";
import { get_template } from "#app/modules/inventory/queries/get_template.ts";
import { get_stores } from "#app/modules/sucursales/queries/get_stores.ts";
import {
  AdmSucursalSelect,
  DISPATCH_STATUS,
  DispatchUpdateDto,
  InvDispatchItemInsert,
  InvDispatchItemSelect,
  InvStockInsert,
  SUCURSAL_TYPE,
} from "@scope/shared";
import { Queue, Worker } from "bullmq";
import { format, parseISO, sub } from "date-fns";
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

interface IDispatch extends InvDispatchItemSelect {
  warehouse_from: string | null;
  warehouse_to: string | null;
  dispatch_at: Date;
}

export class DispatchOrderById {
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
    const stock_from = await this.get_stock(
      store_from,
      items_dispatch,
      date,
      "out",
      username
    );
    const stock_to = await this.get_stock(
      store_to,
      items_dispatch,
      date,
      "in",
      username
    );

    console.log(
      "GUARDAR STOCK : ",
      stock_from.length,
      stock_to.length, // retorna 314 WHYYYY
      stock_to.slice(0, 2)
    );

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
   *
   * @deprecated Este metodo sigue usando un dto anterior
   */
  async execute_and_update(data: DispatchUpdateDto, username: string) {
    let items_dispatch = await this.get_dispatch(data.id);

    items_dispatch = items_dispatch.map((item) => {
      const item_data = data.items.find((el) => el.itemId == item.item_id);
      const quantity = item_data?.quantity
        ? item_data.quantity.toString()
        : item.quantity;
      const total = +item.unit_value * +quantity;

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
    const stock_from = await this.get_stock(
      store_from,
      items_dispatch,
      data.dispatchAt,
      "out",
      username
    );
    const stock_to = await this.get_stock(
      store_to,
      items_dispatch,
      data.dispatchAt,
      "in",
      username
    );

    const item_to_isert: InvDispatchItemInsert[] = items_dispatch.map((el) => ({
      ...el,
      id: undefined,
    }));
    const total = items_dispatch.reduce((acc, el) => acc + +el.total_value, 0);

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
        .values(item_to_isert)
        .executeTakeFirstOrThrow();
    });
  }

  private async get_dispatch(id: number): Promise<IDispatch[]> {
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
      ])
      .where("inv_dispatch.id", "=", id)
      .execute();
    return items_dispatch;
  }

  private async get_stock(
    warehouse: AdmSucursalSelect,
    dispatch_items: IDispatch[],
    date: string,
    dir: "in" | "out" = "out",
    user: string = "sys"
  ) {
    const previous_dispatch_date = format(
      sub(parseISO(date), { days: 1 }),
      "yyyy-MM-dd"
    );
    const [inventory, inventory_before] = await Promise.all([
      get_inventory_by_date(warehouse.id, date),
      get_inventory_by_date(warehouse.id, previous_dispatch_date),
    ]);

    const template = await get_template(
      warehouse.trademark_id ?? PARAMETER.DISPATCH.DEFAULT_TEMPLATE
    );
    const status =
      inventory.length > 0 ? inventory[0].status : DISPATCH_STATUS.NEW;

    const calculate_inventory = template.map((item) => {
      const item_before = inventory_before.find(
        (item_before) => item_before.item_id == item.item_stock.item_id
      );
      const item_now = inventory.find(
        (item_now) => item_now.item_id == item.item_stock.item_id
      );

      const item_dispatched = dispatch_items.find(
        (item_dispatched) =>
          item_dispatched.item_id == item.item_dispatch.item_id
      );
      let new_dispatch_quantity = 0;
      if (item_dispatched) {
        if (item.equivalency == null) {
          new_dispatch_quantity = +item_dispatched.quantity;
        } else {
          if (
            // aunque es measure_to, se refiere a presentacion
            item.item_dispatch.presentation_id == item.equivalency.measure_to
          ) {
            // de derecha a izquierda, cantidad * valor /factor
            new_dispatch_quantity =
              (+item.equivalency.value_from * +item_dispatched.quantity) /
              +item.equivalency.value_factor;
          } else {
            // de izquierda a derecha (default)
            new_dispatch_quantity =
              (+item.equivalency.value_factor * +item_dispatched.quantity) /
              +item.equivalency.value_from;
          }
        }
      }

      const stock_last = item_before ? +item_before.stock_physical : 0;
      const quantity_in_mv = item_now ? +item_now.quantity_in_mv : 0;
      const quantity_out_mv = item_now ? +item_now.quantity_out_mv : 0;
      let quantity_in_dp = item_now ? +item_now.quantity_in_dp : 0;
      let quantity_out_dp = item_now ? +item_now.quantity_out_dp : 0;
      const quantity_in_pu = item_now ? +item_now.quantity_in_pu : 0;
      const quantity_out_sl = item_now ? +item_now.quantity_out_sl : 0;

      let current =
        stock_last -
        quantity_out_dp +
        quantity_in_dp +
        quantity_in_pu -
        quantity_out_sl;
      let price = 0;

      if (warehouse.type_sede == SUCURSAL_TYPE.WAREHOUSE) {
        price = item.item_stock.warehouse_cost;
        if (dir == "in") {
          quantity_in_dp += new_dispatch_quantity;
          current += new_dispatch_quantity;
        } else {
          quantity_out_dp += new_dispatch_quantity;
          current -= new_dispatch_quantity;
        }
      } else {
        price = item.item_stock.store_price;
        if (dir == "in") {
          quantity_in_dp += new_dispatch_quantity;
          current += new_dispatch_quantity;
        } else {
          quantity_out_dp += new_dispatch_quantity;
          current -= new_dispatch_quantity;
        }
      }

      return {
        item_id: item.item_stock.item_id,
        item_name: item.item_stock.item_name,
        presentation_id: item.item_stock.presentation_id,
        presentation_name: item.item_stock.presentation_name,
        stock_at: parseISO(date),
        measure_id: item.item_stock.product_measure_id,
        status,
        created_by: user,
        total_last: item_before ? item_before.total_value : 0,
        stock_last: stock_last,
        quantity_in_dp: quantity_in_dp,
        quantity_out_dp: quantity_out_dp,
        quantity_in_mv: quantity_in_mv,
        quantity_out_mv: quantity_out_mv,
        quantity_in_pu: quantity_in_pu,
        quantity_out_sl: quantity_out_sl,
        warehouse_id: warehouse.id,
        updated_at: new Date(),
        created_at: item_now ? item_now.created_at : new Date(),
        stock_current: current,
        unit_value: price,
        stock_physical: item_now ? +item_now.stock_physical : 0,
        total_value: item_now ? +item_now.total_value : 0,
      } satisfies InvStockInsert;
    });

    return calculate_inventory;
  }

  private async get_involved_stores(
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

    if (!store_from.trademark_id || !store_to.trademark_id) {
      throw new HTTPException(400, {
        message: "El campo compañia es obligatorio",
      });
    }

    return { store_from, store_to };
  }

  private validate_data(data: IDispatch[]) {
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
