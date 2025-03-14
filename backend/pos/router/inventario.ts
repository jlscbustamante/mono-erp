import { add, format, parseISO, sub } from "date-fns";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { redis } from "../cache/index.ts";
import { stockRepository } from "../repository/dependencies.ts";
import { IStock } from "./types.ts";

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
