import { stocks, StockSelect, SucursalSelect } from "@scope/pizzadb";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { and, desc, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { cache } from "../cache/index.ts";
import { db } from "../database.ts";
import { minutesToMilliseconds } from "../utils.ts";
import { templateRepository } from "./dependencies.ts";
import { ItemSelectRelations } from "./template.repository.ts";

interface OldResponseStock {
  id?: number;
  itemId: number;
  totalInitial: number;
  categoryName: string;
  itemName: string;
  presentationId: number;
  presentationName: string;
  measureId: number;
  warehouseId: string;
  stockAt: string;
  initialStock: number;
  stockCurrent: number;
  stockPhysical: number;
  unitValue: number;
  totalValue: number;
  createdBy: string;
  status: number;
  quantityInMv: number;
  quantityOutMv: number;
  quantityInDispatch: number;
  quantityInPurchase: number;
  quantityOutDispatch: number;
  quantityOutSale: number;
}

export class StockRepository {
  async stores(): Promise<SucursalSelect[]> {
    const cached = cache.get("stores");
    if (cached) return JSON.parse(cached);
    const stores = await db.query.sucursalTable.findMany();

    cache.set("stores", JSON.stringify(stores), {
      ttl: minutesToMilliseconds(60 * 3),
    });

    return stores;
  }

  async getStockWrapper(props: {
    storeId: string;
    start: string;
    end: string;
    companyId?: string;
  }) {
    const stock = await this.getStockStore(props);
    const lastClosed = await this.getLastClose(props.storeId);
    const stores = await this.stores();
    const store = stores.find((s) => s.id === props.storeId);

    const oldStock: OldResponseStock[] = stock.map((s) => {
      return {
        id: s.id,
        itemId: s.item_id,
        totalInitial: s.total_last,
        categoryName: "",
        itemName: s.item_name,
        presentationId: s.presentation_id,
        presentationName: s.presentation_name,
        measureId: s.measure_id,
        warehouseId: s.warehouse_id,
        stockAt: s.stock_at,
        initialStock: s.stock_last,
        stockCurrent: s.stock_current,
        stockPhysical: s.stock_physical,
        unitValue: s.unit_value,
        totalValue: s.total_value,
        createdBy: s.created_by,
        status: s.status,
        quantityInMv: s.quantity_in_mv,
        quantityOutMv: s.quantity_out_mv,
        quantityInDispatch: s.quantity_in_dp,
        quantityInPurchase: s.quantity_in_pu,
        quantityOutDispatch: s.quantity_out_dp,
        quantityOutSale: s.quantity_out_sl,
      };
    });

    return {
      lastClosed,
      stock: oldStock,
      warehouseName: store?.title ?? "",
      isEmpty: stock.length === 0 || !lastClosed,
    };
  }

  async getLastClose(storeId: string): Promise<string | null> {
    const cached = cache.get("lastClose:" + storeId);
    if (cached) return JSON.parse(cached);
    const lastClosed = await db.query.stocks.findFirst({
      where: and(eq(stocks.warehouse_id, storeId), eq(stocks.status, 2)),
      orderBy: desc(stocks.stock_at),
    });
    const date = lastClosed?.stock_at?.split(" ")[0] ?? null;
    cache.set("lastClose:" + storeId, JSON.stringify(date));
    return date;
  }

  async getStockStore(props: {
    storeId: string;
    start: string;
    end: string;
    companyId?: string;
  }): Promise<StockSelect[]> {
    const company = props.companyId ?? "PIZZA";
    if (props.start === props.end) {
      return await this.stock(props.storeId, props.start, company);
    }
    return await this.stockRange(
      props.storeId,
      props.start,
      props.end,
      company
    );
  }

  async stock(
    storeId: string,
    date: string,
    companyId = "PIZZA"
  ): Promise<StockSelect[]> {
    const chached = cache.get("stock:" + storeId + ":" + date);
    if (chached) return JSON.parse(chached);
    const stores = await this.stores();
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      throw new HTTPException(404, {
        message: "La tienda no existe : " + storeId,
      });
    }
    const stock: StockSelect[] = await db.query.stocks.findMany({
      where: and(
        eq(stocks.warehouse_id, storeId),
        sql`DATE(${stocks.stock_at})=${date}`
      ),
    });
    const template: ItemSelectRelations[] =
      await templateRepository.getTemplate(companyId);

    const union = this.union(template, stock, {
      date,
      warehouseId: storeId,
    });

    cache.set("stock:" + storeId + ":" + date, JSON.stringify(union));
    return union;
  }

  async stockRange(
    storeId: string,
    start: string,
    end: string,
    companyId = "PIZZA"
  ): Promise<StockSelect[]> {
    const dates = eachDayOfInterval({
      start: parseISO(start),
      end: parseISO(end),
    }).map((el) => format(el, "yyyy-MM-dd"));

    const stocks: StockSelect[][] = await Promise.all(
      dates.map(async (date) => {
        return await this.stock(storeId, date, companyId);
      })
    );
    const flat = this.flatStock(stocks, { start, end });

    return flat;
  }

  private flatStock(
    stocksArray: StockSelect[][],
    props: { start: string; end: string }
  ): StockSelect[] {
    const initial = stocksArray[0];
    const final = stocksArray[stocksArray.length - 1];
    const container: Record<number, StockSelect> = stocksArray[0].reduce(
      (acc, stock) => {
        acc[stock.item_id] = {
          ...stock,
          stock_current: 0,
          stock_last: 0,
          stock_physical: 0,
          quantity_in_dp: 0,
          quantity_in_mv: 0,
          quantity_in_pu: 0,
          quantity_out_dp: 0,
          quantity_out_mv: 0,
          quantity_out_sl: 0,
          total_last: 0,
          total_value: 0,
        };
        return acc;
      },
      {} as Record<number, StockSelect>
    );
    for (const stock of stocksArray) {
      for (const item of stock) {
        container[item.item_id].quantity_in_dp += item.quantity_in_dp;
        container[item.item_id].quantity_in_mv += item.quantity_in_mv;
        container[item.item_id].quantity_in_pu += item.quantity_in_pu;
        container[item.item_id].quantity_out_dp += item.quantity_out_dp;
        container[item.item_id].quantity_out_mv += item.quantity_out_mv;
        container[item.item_id].quantity_out_sl += item.quantity_out_sl;
      }
    }
    let stock: StockSelect[] = Object.values(container);
    stock = stock.map((el) => {
      const initialStock = initial.find((s) => s.item_id === el.item_id);
      const finalStock = final.find((s) => s.item_id === el.item_id);

      const current =
        (initialStock?.stock_last ?? 0) +
        el.quantity_in_dp +
        el.quantity_in_mv -
        el.quantity_out_mv -
        el.quantity_out_sl;

      return {
        ...el,
        stock_last: initialStock?.stock_last ?? 0,
        total_last: initialStock?.total_last ?? 0,
        stock_physical: finalStock?.stock_physical ?? 0,
        total_value: finalStock?.total_value ?? 0,
        unit_value: finalStock?.unit_value ?? el.unit_value,
        stock_current: +current.toFixed(2),
        stock_at: `${props.start} - ${props.end}`,
      };
    });
    return stock;
  }

  private union(
    template: ItemSelectRelations[],
    stock: StockSelect[],
    props: { date: string; warehouseId: string }
  ): StockSelect[] {
    const allStock: StockSelect[] = [];
    for (const item of template) {
      const stockItem = stock.find((s) => s.item_id === item.id);
      if (stockItem) {
        allStock.push(stockItem);
      } else {
        allStock.push({
          id: 0,
          item_id: item.id,
          item_name: item.item_name,
          warehouse_id: props.warehouseId,
          stock_at: props.date,
          created_at: format(new Date(), "yyyy-MM-dd"),
          created_by: "sys",
          measure_id: item.measure_id,
          presentation_id: item.presentation_id,
          presentation_name: item.presentation.presentation ?? "",
          quantity_in_dp: 0,
          quantity_in_mv: 0,
          quantity_in_pu: 0,
          quantity_out_dp: 0,
          quantity_out_mv: 0,
          quantity_out_sl: 0,
          stock_current: 0,
          stock_last: 0,
          stock_physical: 0,
          total_last: 0,
          total_value: 0,
          unit_value: item.unit_price,
          status: 1,
          updated_at: format(new Date(), "yyyy-MM-dd"),
          // created_at: format,
        });
      }
    }
    const itemsNotInTemplate = stock.filter(
      (s) => !template.some((t) => t.id === s.item_id)
    );

    allStock.push(...itemsNotInTemplate);

    return allStock;
  }
}
