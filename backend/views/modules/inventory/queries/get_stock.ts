import { db } from "#app/config/database.ts";
import { get_template } from "#app/modules/inventory/queries/get_template.ts";
import {
  DISPATCH_STATUS,
  InvStockSelect,
  InvStockSelectOptionalId,
  SUCURSAL_TYPE,
} from "@scope/shared";
import { format, parseISO, sub } from "date-fns";
import { sql } from "kysely";

export const get_inventory_by_date = async (
  store: string,
  date: string
): Promise<InvStockSelect[]> => {
  const inventory = await db
    .selectFrom("inv_stock")
    .where("warehouse_id", "=", store)
    .where(sql`DATE(stock_at)`, "=", date)
    .selectAll()
    .execute();

  return inventory;
};

/**
 * @description inventario tomando en cuenta la fecha anterior para el inicial(sin usar el template)
 */
export const get_calculated_stock = async (
  warehouse_code: string,
  date: string
): Promise<InvStockSelectOptionalId[]> => {
  const previousDay = format(sub(parseISO(date), { days: 1 }), "yyyy-MM-dd");
  const [previous_stock, stock] = await Promise.all([
    get_inventory_by_date(warehouse_code, previousDay),
    get_inventory_by_date(warehouse_code, date),
  ]);
  const items_not_in_current_stock = previous_stock.filter(
    (item) => !stock.find((current) => current.item_id == item.item_id)
  );

  const stock_calculated: InvStockSelectOptionalId[] = stock.map((item) => {
    const previous_item = previous_stock.find(
      (current) => current.item_id == item.item_id && current.status == 2
    );
    const total_last = previous_item
      ? +previous_item.total_value
      : +item.total_last;
    const stock_last = previous_item
      ? +previous_item.stock_physical
      : +item.stock_last;
    const quantity_in_dp = +item.quantity_in_dp;
    const quantity_in_mv = +item.quantity_in_mv;
    const quantity_out_dp = +item.quantity_out_dp;
    const quantity_out_mv = +item.quantity_out_mv;
    const quantity_in_pu = +item.quantity_in_pu;
    const quantity_out_sl = +item.quantity_out_sl;

    const current =
      stock_last +
      quantity_in_dp +
      quantity_in_mv -
      quantity_out_dp -
      quantity_out_mv +
      quantity_in_pu -
      quantity_out_sl;

    return {
      ...item,
      total_last: total_last.toString(),
      stock_last: stock_last.toString(),
      stock_current: current.toString(),
    } satisfies InvStockSelect;
  });

  items_not_in_current_stock.forEach((item) => {
    const stock_last = +item.stock_physical;
    const total_last = +item.total_value;
    stock_calculated.push({
      ...item,
      id: undefined,
      stock_last: stock_last.toString(),
      total_last: total_last.toString(),
      stock_current: stock_last.toString(),
      stock_at: parseISO(date),
    });
  });

  return stock_calculated;
};

/**
 * @description inventario tomando en cuenta la fecha anterior para el inicial(usa el template)
 */
export const generate_stock_report = async (
  warehouse_code: string,
  date: string,
  template_id: string,
  warehouse_type: SUCURSAL_TYPE
): Promise<InvStockSelectOptionalId[]> => {
  const template = await get_template(template_id);
  const previousDay = format(sub(parseISO(date), { days: 1 }), "yyyy-MM-dd");
  const [previous_stock, stock] = await Promise.all([
    get_inventory_by_date(warehouse_code, previousDay),
    get_inventory_by_date(warehouse_code, date),
  ]);
  const status = stock.length > 0 ? stock[0].status : DISPATCH_STATUS.NEW;

  const stock_calculated: InvStockSelectOptionalId[] = stock.map((item) => {
    const previous_item = previous_stock.find(
      (current) => current.item_id == item.item_id && current.status == 2
    );
    const total_last = previous_item
      ? +previous_item.total_value
      : +item.total_last;
    const stock_last = previous_item
      ? +previous_item.stock_physical
      : +item.stock_last;
    const quantity_in_dp = +item.quantity_in_dp;
    const quantity_in_mv = +item.quantity_in_mv;
    const quantity_out_dp = +item.quantity_out_dp;
    const quantity_out_mv = +item.quantity_out_mv;
    const quantity_in_pu = +item.quantity_in_pu;
    const quantity_out_sl = +item.quantity_out_sl;

    const current =
      stock_last +
      quantity_in_dp +
      quantity_in_mv -
      quantity_out_dp -
      quantity_out_mv +
      quantity_in_pu -
      quantity_out_sl;

    return {
      ...item,
      total_last: total_last.toString(),
      stock_last: stock_last.toString(),
      stock_current: current.toString(),
    } satisfies InvStockSelectOptionalId;
  });

  for (const item of template) {
    if (
      !stock_calculated.find(
        (current) => current.item_id == item.item_stock.item_id
      )
    ) {
      const previous_item = previous_stock.find(
        (current) =>
          current.item_id == item.item_stock.item_id && current.status == 2
      );

      const total_last = previous_item ? +previous_item.total_value : 0;
      const stock_last = previous_item ? +previous_item.stock_physical : 0;

      stock_calculated.push({
        created_at: new Date(),
        created_by: "sys",
        item_id: item.item_stock.item_id,
        item_name: item.item_stock.item_name,
        measure_id: item.item_stock.product_measure_id,
        presentation_id: item.item_stock.presentation_id,
        presentation_name: item.item_stock.presentation_name,
        quantity_in_dp: "0",
        quantity_in_mv: "0",
        quantity_in_pu: "0",
        quantity_out_dp: "0",
        quantity_out_mv: "0",
        quantity_out_sl: "0",
        status,
        stock_at: parseISO(date),
        stock_current: stock_last.toString(),
        stock_last: stock_last.toString(),
        stock_physical: "0",
        total_last: total_last.toString(),
        unit_value:
          warehouse_type == SUCURSAL_TYPE.STORE
            ? item.item_stock.store_price.toString()
            : item.item_stock.warehouse_cost.toString(),
        total_value: "0",
        updated_at: new Date(),
        warehouse_id: warehouse_code,
      });
    }
  }

  const items_not_in_current_stock = previous_stock.filter(
    (item) =>
      !stock_calculated.find((current) => current.item_id == item.item_id)
  );

  items_not_in_current_stock.forEach((item) => {
    const stock_last = +item.stock_physical;
    const total_last = +item.total_value;
    stock_calculated.push({
      ...item,
      id: undefined,
      stock_last: stock_last.toString(),
      total_last: total_last.toString(),
      stock_current: stock_last.toString(),
      quantity_in_dp: "0",
      quantity_in_mv: "0",
      quantity_out_dp: "0",
      quantity_out_mv: "0",
      quantity_in_pu: "0",
      quantity_out_sl: "0",
      stock_physical: "0",
      total_value: "0",
      status: stock_calculated[0]?.status ?? DISPATCH_STATUS.NEW,
      stock_at: parseISO(date),
    });
  });

  return stock_calculated;
};
