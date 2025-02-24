import { Hono } from "hono";
import { stockRepository } from "../repository/dependencies.ts";

export const invetarioRouter = new Hono()
  .get("/info", async (c) => {
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
