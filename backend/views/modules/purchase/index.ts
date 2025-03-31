import { purchase_report } from "#app/modules/purchase/queries/report.ts";
import { IPurchaseReportProps } from "@scope/shared";
import { Hono } from "hono";

export const purchase_router = new Hono().get("/report", async (c) => {
  const props = c.req.query() as unknown as IPurchaseReportProps;
  if (!props.end || !props.start) {
    throw new Error("Faltan parametros");
  }
  const data = await purchase_report(props);
  return c.json({ message: "ok", data });
});
