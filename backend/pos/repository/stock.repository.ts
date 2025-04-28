import {
  StockInsert,
  stocks,
  StockSelect,
  SucursalSelect,
  sucursalTable,
} from "@scope/pizzadb";
import {
  add,
  eachDayOfInterval,
  format,
  minutesToSeconds,
  parseISO,
  sub,
} from "date-fns";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { redis } from "../cache/index.ts";
import { db } from "../database.ts";
import { IStock } from "../router/types.ts";
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
  warehouseName?: string;
}

interface StockSelectWithCategory extends StockSelect {
  categoryName?: string;
}

export class StockRepository {
  async stores(): Promise<SucursalSelect[]> {
    const cached = await redis.get("stores");
    if (cached) return JSON.parse(cached);
    const stores = await db.query.sucursalTable.findMany();

    await redis.set(
      "stores",
      JSON.stringify(stores),
      "EX",
      minutesToSeconds(60 * 2)
    );

    return stores;
  }

  async getStockByCompany({
    company_id,
    date,
  }: {
    company_id: string;
    date: string;
  }) {
    const cached = await redis.get(
      "pos:stock_company:" + company_id + ":" + date
    );
    if (cached) return JSON.parse(cached);
    const stores = await db.query.sucursalTable.findMany({
      columns: {
        id: true,
      },
      where: eq(sucursalTable.trademark_id, company_id),
      orderBy: asc(sucursalTable.title),
    });
    const storeIds = stores.map((s) => s.id);
    const [stock] = await db.execute(
      sql`SELECT ist.*,icat.category,adsu.title FROM inv_stock ist LEFT JOIN adm_sucursal adsu ON ist.warehouse_id=adsu.id LEFT JOIN inv_item ii ON ist.item_id =ii.id LEFT JOIN inv_product ipro ON ipro.id=ii.subcategory_id LEFT JOIN inv_category icat ON icat.id=ipro.category_id WHERE warehouse_id IN ${storeIds} AND DATE(stock_at)=${date}`
    );
    const stock_result: OldResponseStock[] = (
      stock as unknown as (StockSelect & {
        category: string;
        title: string;
      })[]
    ).map(
      (el) =>
        ({
          id: el.id,
          itemId: el.item_id,
          itemName: el.item_name,
          categoryName: el.category ?? "",
          presentationId: el.presentation_id,
          presentationName: el.presentation_name,
          measureId: el.measure_id,
          createdBy: el.created_by,
          stockAt: format(parseISO(el.stock_at), "yyyy-MM-dd"),
          stockCurrent: +el.stock_current,
          warehouseName: el.title,
          stockPhysical: +el.stock_physical,
          unitValue: +el.unit_value,
          totalValue: +el.total_value,
          totalInitial: +el.total_last,
          initialStock: +el.stock_last,
          quantityInDispatch: +el.quantity_in_dp,
          quantityInMv: +el.quantity_in_mv,
          quantityInPurchase: +el.quantity_in_pu,
          quantityOutDispatch: +el.quantity_out_dp,
          quantityOutMv: +el.quantity_out_mv,
          quantityOutSale: +el.quantity_out_sl,
          warehouseId: el.warehouse_id,
          status: el.status,
        } satisfies OldResponseStock)
    );

    await redis.set(
      "pos:stock_company:" + company_id + ":" + date,
      JSON.stringify(stock_result),
      "EX",
      minutesToSeconds(5)
    );
    return stock_result;
  }

  async getStockWrapper(props: {
    storeId: string;
    start: string;
    end: string;
    companyId?: string;
  }) {
    const lastClosed = await this.getLastClose(props.storeId);
    const stores = await this.stores();
    const store = stores.find((s) => s.id === props.storeId);
    const stock = await this.getStockStore({
      ...props,
      companyId: store?.guide_template ?? props.companyId ?? undefined,
    });

    const oldStock: OldResponseStock[] = stock.map((s) => {
      const current =
        s.stock_last +
        s.quantity_in_dp +
        s.quantity_in_mv -
        s.quantity_out_mv -
        s.quantity_out_sl;
      return {
        id: s.id,
        itemId: s.item_id,
        totalInitial: s.total_last,
        categoryName: s.categoryName ?? "",
        itemName: s.item_name,
        presentationId: s.presentation_id,
        presentationName: s.presentation_name,
        measureId: s.measure_id,
        warehouseId: s.warehouse_id,
        stockAt: s.stock_at,
        initialStock: s.stock_last,
        stockCurrent: current,
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
    const cached = await redis.get("lastClose:" + storeId);
    if (cached) return JSON.parse(cached);
    const lastClosed = await db.query.stocks.findFirst({
      where: and(eq(stocks.warehouse_id, storeId), eq(stocks.status, 2)),
      orderBy: desc(stocks.stock_at),
    });
    const date = lastClosed?.stock_at?.split(" ")[0] ?? null;
    await redis.set("lastClose:" + storeId, JSON.stringify(date));
    return date;
  }

  async getStockStore(props: {
    storeId: string;
    start: string;
    end: string;
    companyId?: string;
  }): Promise<StockSelectWithCategory[]> {
    const stores = await this.stores();
    const store = stores.find((s) => s.id === props.storeId);

    const company = store?.guide_template ?? props.companyId ?? "PIZZARAUL";
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
    companyId = "PIZZARAUL"
  ): Promise<StockSelectWithCategory[]> {
    const cached = await redis.get("stock:" + storeId + ":" + date);

    if (cached) return JSON.parse(cached);
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

    await redis.set(
      "stock:" + storeId + ":" + date,
      JSON.stringify(union),
      "EX",
      minutesToSeconds(60 * 2)
    );
    return union;
  }

  async stockRange(
    storeId: string,
    start: string,
    end: string,
    companyId = "PIZZARAUL"
  ): Promise<StockSelectWithCategory[]> {
    const dates = eachDayOfInterval({
      start: parseISO(start),
      end: parseISO(end),
    }).map((el) => format(el, "yyyy-MM-dd"));

    const stocks: StockSelectWithCategory[][] = await Promise.all(
      dates.map(async (date) => {
        return await this.stock(storeId, date, companyId);
      })
    );
    const flat = this.flatStock(stocks, { start, end });

    return flat;
  }

  private flatStock(
    stocksArray: StockSelectWithCategory[][],
    props: { start: string; end: string }
  ): StockSelectWithCategory[] {
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
  ): StockSelectWithCategory[] {
    const allStock: StockSelectWithCategory[] = [];
    for (const item of template) {
      const stockItem = stock.find((s) => s.item_id === item.id);
      if (stockItem) {
        allStock.push({
          ...stockItem,
          categoryName: item.product.category.category ?? "",
        });
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
          categoryName: item.product.category?.category ?? "",
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

  async saveStock(props: {
    date: string;
    warehouse: string;
    stock: IStock[];
    companyId?: string;
  }) {
    const stores = await this.stores();
    const store = stores.find((s) => s.id === props.warehouse);
    const companyId = store?.guide_template ?? props.companyId;
    // const last_closed = await this.getLastClose(props.warehouse);

    // if (last_closed) {
    //   if (props.date < last_closed) {
    //     throw new HTTPException(400, {
    //       message: "La fecha no puede ser menor a la ultima fecha de cierre",
    //     });
    //   }
    // }

    const beforeDay = format(
      sub(parseISO(props.date), { days: 1 }),
      "yyyy-MM-dd"
    );
    // TODO: Solucianar esto, no deberiamos consultar el stock del dia anterior
    // en realidad con consultar el de hoy deberia bastar, acaso no es confiable ?
    const stockBefore = await this.getStockStore({
      storeId: props.warehouse,
      start: beforeDay,
      end: beforeDay,
    });
    const stock = await this.getStockStore({
      storeId: props.warehouse,
      start: props.date,
      end: props.date,
      companyId: companyId,
    });
    const newStock = this.newStock({
      before: stockBefore,
      now: stock,
      mod: props.stock,
      date: props.date,
      warehouse: props.warehouse,
    });

    const fix_stock = await this.fixNextStock(
      props.warehouse,
      props.date,
      newStock,
      companyId
    );

    const all_stock: StockInsert[] = [...newStock, ...(fix_stock?.stock ?? [])];

    await db.transaction(async (trx) => {
      await trx
        .delete(stocks)
        .where(
          and(
            eq(stocks.warehouse_id, props.warehouse),
            sql`DATE(${stocks.stock_at}) IN (${props.date},${
              fix_stock?.tomorrow_date ? fix_stock.tomorrow_date : props.date
            })`
          )
        );

      if (newStock.length > 0) {
        await trx.insert(stocks).values(all_stock);
      }
    });

    await redis.del("stock:" + props.warehouse + ":" + props.date);
    if (fix_stock?.tomorrow_date) {
      await redis.del(
        "stock:" + props.warehouse + ":" + fix_stock.tomorrow_date
      );
    }
    await redis.del("lastClose:" + props.warehouse);
  }

  /**
   * @description Fixea el stock del dia siguiente si la fecha es anterior al dia de hoy.
   */
  private async fixNextStock(
    storeId: string,
    date: string,
    new_stock: StockInsert[],
    companyId?: string
  ): Promise<{ tomorrow_date: string; stock: StockInsert[] } | null> {
    const today = format(new Date(), "yyyy-MM-dd");
    if (date < today) {
      const tomorrow = format(add(parseISO(date), { days: 1 }), "yyyy-MM-dd");

      const tomorrow_stock = await this.stock(storeId, tomorrow, companyId);

      if (tomorrow_stock.length == 0) return null;

      const status = tomorrow_stock[0].status;

      const new_stock_tomorrow: StockInsert[] = tomorrow_stock.map((el) => {
        const item = new_stock.find((s) => s.item_id === el.item_id);
        if (item) {
          const new_current =
            (item.stock_physical ?? 0) +
            el.quantity_in_dp +
            el.quantity_in_mv -
            el.quantity_out_mv;
          return {
            ...el,
            id: undefined,
            stock_last: item.stock_physical ?? 0,
            total_last: item.total_value ?? 0,
            stock_current: new_current,
          };
        }

        return el;
      });

      const itemsNotInTomorrowStock = new_stock.filter(
        (s) => !tomorrow_stock.some((t) => t.item_id === s.item_id)
      );

      const newItems: StockInsert[] = itemsNotInTomorrowStock.map((item) => ({
        ...item,
        id: undefined,
        stock_at: tomorrow,
        stock_last: item.stock_physical ?? 0,
        total_last: item.total_value ?? 0,
        quantity_in_dp: 0,
        quantity_in_mv: 0,
        quantity_in_pu: 0,
        quantity_out_mv: 0,
        quantity_out_dp: 0,
        status: status,
        stock_current: item.stock_physical ?? 0,
      }));

      new_stock_tomorrow.push(...newItems);

      return {
        stock: new_stock_tomorrow,
        tomorrow_date: tomorrow,
      };
    }
    return null;
  }

  private newStock({
    before,
    now,
    mod,
    date,
    warehouse,
  }: {
    before: StockSelectWithCategory[];
    now: StockSelectWithCategory[];
    mod: IStock[];
    date: string;
    warehouse: string;
  }): StockInsert[] {
    const stock: StockInsert[] = [];
    const createdAt = format(new Date(), "yyyy-MM-dd");
    for (const itemMod of mod) {
      const itemBefore = before.find((s) => s.item_id === itemMod.itemId);
      const itemDb = now.find((s) => s.item_id === itemMod.itemId);

      const provitional: StockInsert = {
        stock_last: itemBefore?.stock_physical ?? 0,
        total_last: itemBefore?.total_value ?? 0,
        item_id: itemMod.itemId,
        item_name: itemMod.itemName,
        measure_id: itemMod.measureId,
        presentation_id: itemMod.presentationId,
        presentation_name: itemMod.presentationName,
        stock_at: date,
        warehouse_id: warehouse,
        status: 2,
        quantity_in_dp: itemDb?.quantity_in_dp ?? itemMod.quantityInDispatch,
        quantity_in_mv: itemDb?.quantity_in_mv ?? itemMod.quantityInMv,
        quantity_in_pu: itemDb?.quantity_in_pu ?? 0,
        quantity_out_dp: itemDb?.quantity_out_dp ?? 0,
        quantity_out_mv: itemDb?.quantity_out_mv ?? 0,
        quantity_out_sl: itemDb?.quantity_out_sl ?? 0,
        stock_physical: itemMod.stockPhysical ?? 0,
        total_value: itemMod.totalValue ?? 0,
        unit_value:
          itemDb?.unit_value ??
          itemMod.unitValue ??
          itemBefore?.unit_value ??
          0,
        created_by: "sys",
        created_at: createdAt,
      };
      const stockCurrent =
        (provitional.stock_last ?? 0) +
        (provitional.quantity_in_dp ?? 0) +
        (provitional.quantity_in_mv ?? 0) -
        (provitional.quantity_out_mv ?? 0) -
        (provitional.quantity_out_sl ?? 0);
      provitional.stock_current = stockCurrent;
      stock.push(provitional);
    }

    const validStock: StockInsert[] = stock.filter((el) => {
      if (el.stock_current == 0 && el.stock_physical == 0) return false;
      return true;
    });
    if (validStock.length === 0) {
      validStock.push(stock[0]);
    }

    return validStock;
  }
}
