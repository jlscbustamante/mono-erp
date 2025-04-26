import { add, format, parseISO, sub } from "date-fns";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { dispatches, dispatchesItems } from "../../pizzadb/index.ts";
import { redis } from "../cache/index.ts";
import { db } from "../database.ts";
import { stockRepository } from "../repository/dependencies.ts";
import { IStock, MoveInfo } from "./types.ts";

export const invetarioRouter = new Hono()
  .get(
    "/info",
    rateLimiter({
      windowMs: 1000 * 3,
      limit: 1,
      standardHeaders: "draft-6",
      keyGenerator: (c) => c.req.query()?.warehouse ?? "",
    }),
    async (c) => {
      const props = c.req.query() as {
        warehouse: string;
        end: string;
        start: string;
        company?: string;
      };
      if (!props.warehouse || !props.start || !props.end) {
        throw new Error("Faltan parametros");
      }
      const stock = await stockRepository.getStockWrapper({
        end: props.end,
        start: props.start,
        storeId: props.warehouse,
        companyId: props.company ? props.company : undefined,
      });

      return c.json({
        data: stock,
      });
    }
  )
  .get(
    "/info_company",
    rateLimiter({
      windowMs: 1000 * 2,
      limit: 1,
      standardHeaders: "draft-6",
      keyGenerator: (c) => c.req.query()?.company_id ?? "",
    }),
    async (c) => {
      const { company_id, date } = c.req.query() as {
        company_id: string;
        date: string;
      };
      if (!company_id || !date) {
        throw new Error("Faltan parametros");
      }

      const data = await stockRepository.getStockByCompany({
        company_id,
        date,
      });

      return c.json({
        data,
      });
    }
  )
  .get("/clearcache", async (c) => {
    const { warehouse, date } = c.req.query() as {
      warehouse: string;
      date: string;
    };
    if (warehouse && date) {
      const today = parseISO(date);
      const before = format(sub(today, { days: 1 }), "yyyy-MM-dd");
      const tomorrow = format(add(today, { days: 1 }), "yyyy-MM-dd");
      await redis.del("stock:" + warehouse + ":" + date);
      await redis.del("stock:" + warehouse + ":" + before);
      await redis.del("stock:" + warehouse + ":" + tomorrow);
      await redis.del("lastClose:" + warehouse);
    }
    return c.json({ message: "ok" });
  })
  .post("/save_stock", async (c) => {
    const { date, warehouse, stock, company } = (await c.req.json()) as {
      date: string;
      warehouse: string;
      stock: IStock[];
      company: string;
    };
    if (!date || !warehouse || !stock || !company) {
      throw new Error("Faltan parametros");
    }
    await stockRepository.saveStock({
      date,
      warehouse,
      stock,
      companyId: company ? company : undefined,
    });
    return c.json({ message: "ok", data: warehouse });
  })
  .get("/stock", async (c) => {
    const props = c.req.query() as {
      warehouse: string;
      end: string;
      start: string;
    };
    const data = await stockRepository.getStockStore({
      end: props.end,
      start: props.start,
      storeId: props.warehouse,
      companyId: "PIZZARAUL",
    });
    return c.json({ data });
  })
  .get("/last_closed", async (c) => {
    const { warehouse } = c.req.query() as {
      warehouse: string;
    };
    if (!warehouse) {
      throw new Error("Faltan parametros");
    }
    const date = await stockRepository.getLastClose(warehouse);

    return c.json({
      data: date,
    });
  })
  .get("/move_info", async (c) => {
    const props = c.req.query() as {
      start: string;
      end: string;
      warehouse: string;
      type: string;
      itemId: string;
    };
    const itemId = +props.itemId;
    // type =='in' ingreso
    // type=='out' salida

    // salida
    const list = await db.query.dispatches.findMany({
      columns: {
        id: true,
        gloss: true,
        sucursal_from_id: true,
        sucursal_to_id: true,
        move_at: true,
        move_type: true,
      },
      where: and(
        props.type === "in"
          ? eq(dispatches.sucursal_to_id, props.warehouse)
          : eq(dispatches.sucursal_from_id, props.warehouse),
        // sql`date(${dispatches.move_at})=${props.date}`,
        sql`date(${dispatches.move_at}) BETWEEN ${props.start} AND ${props.end}`,
        eq(dispatches.move_type, "M"),
        eq(dispatches.status, 3)
      ),
      with: {
        items: {
          where: eq(dispatchesItems.item_id, itemId),
        },
        origin: true,
        destiny: true,
      },
    });
    const listItems = list.filter((el) =>
      el.items.some((il) => il.item_id == itemId)
    );

    const info: MoveInfo[] = [];

    for (const item of listItems) {
      const itemInfo = item.items.find((el) => el.item_id == itemId);
      if (itemInfo) {
        info.push({
          date: item.move_at?.split(" ")[0],
          quantity: itemInfo.quantity,
          description: item.gloss ?? "",
          itemId: itemInfo.item_id,
          itemName: itemInfo.item_name,
          actor: props.type === "in" ? item.origin?.title : item.destiny?.title,
        });
      }
    }

    return c.json({
      message: "ok",
      data: info,
    });
  })
  .get("/cachear", async (c) => {
    const stores = await stockRepository.stores();
    const date = format(new Date(), "yyyy-MM-dd");
    console.log("generando cache para tiendas");
    for (const store of stores) {
      await stockRepository.getStockWrapper({
        end: date,
        start: date,
        storeId: store.id,
        companyId: store.trademark_id == "PIZZAM" ? "PIZZAM" : "PIZZARAUL",
      });
    }
    return c.json({
      message: "ok",
    });
  });
