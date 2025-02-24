import { add, format, parseISO, sub } from "date-fns";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cache } from "../cache/index.ts";
import { stockRepository } from "../repository/dependencies.ts";

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
  .get("/clearcache", (c) => {
    const { warehouse, date } = c.req.query() as {
      warehouse: string;
      date: string;
    };
    if (warehouse && date) {
      const today = parseISO(date);
      const before = format(sub(today, { days: 1 }), "yyyy-MM-dd");
      const tomorrow = format(add(today, { days: 1 }), "yyyy-MM-dd");
      cache.delete("stock:" + warehouse + ":" + date);
      cache.delete("stock:" + warehouse + ":" + before);
      cache.delete("stock:" + warehouse + ":" + tomorrow);
    }
    return c.json({ message: "ok" });
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
      companyId: "PIZZA",
    });
    return c.json({ data });
  });
