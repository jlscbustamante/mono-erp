// fixea el total last y final de una fecha usando
// usando el ultimo inventario(para el last) y el inico del dia despues(para el final)

import { StockInsert, stocks, StockSelect } from "@scope/pizzadb";
import dayjs from "dayjs";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../database.ts";

// INPUTS
const date = "2025-01-18";
const warehouseCode = "HABI";

// APP
const before = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
const after = dayjs(date).add(1, "day").format("YYYY-MM-DD");

async function getStock(code: string, date: string): Promise<StockSelect[]> {
  const stocksStore = await db.query.stocks.findMany({
    where: and(
      eq(stocks.warehouse_id, code),
      sql`DATE(${stocks.stock_at}) = ${date}`
    ),
    orderBy: asc(stocks.item_name),
  });
  return stocksStore;
}

function transformBefore(stock: StockSelect, date: string): StockSelect {
  return {
    ...stock,
    quantity_in_dp: 0,
    quantity_in_mv: 0,
    quantity_in_pu: 0,
    quantity_out_dp: 0,
    quantity_out_mv: 0,
    quantity_out_sl: 0,
    total_value: 0,
    stock_physical: 0,
    stock_at: date,
    total_last: 0,
    stock_last: 0,
    stock_current: 0,
  };
}

async function app() {
  const [stockBefore, stockStore, stockAfter] = await Promise.all([
    getStock(warehouseCode, before),
    getStock(warehouseCode, date),
    getStock(warehouseCode, after),
  ]);

  const stockIds = stockStore.map((el) => el.item_id);
  const values: StockInsert[] = [];
  const itemsBefore = stockBefore.filter(
    (el) => !stockIds.includes(el.item_id)
  );

  const allItems: StockSelect[] = [
    ...itemsBefore.map((el) => transformBefore(el, date)),
    ...stockStore,
  ];

  for (const stockItem of allItems) {
    const itemBefore = stockBefore.find(
      (el) => el.item_id == stockItem.item_id
    );
    const itemAfter = stockAfter.find((el) => el.item_id == stockItem.item_id);

    const stockLast = itemBefore?.stock_physical ?? 0;
    const totalLast = itemBefore?.total_value ?? 0;

    const stockFinal = itemAfter?.stock_last ?? 0;
    const totalFinal = itemAfter?.total_last ?? 0;

    const current = stockItem.stock_current + stockLast;

    values.push({
      ...stockItem,
      id: undefined,
      stock_last: stockLast,
      total_last: totalLast,
      stock_physical: stockFinal,
      total_value: totalFinal,
      stock_current: current,
    });
  }

  await db.transaction(async (manager) => {
    await manager
      .delete(stocks)
      .where(
        and(
          eq(stocks.warehouse_id, warehouseCode),
          sql`DATE(${stocks.stock_at}) = ${date}`
        )
      );

    await manager.insert(stocks).values(values);
  });
}

// fixear aquellos que existen ayer pero no hoy

// RUN
await app();

Deno.exit(0);
