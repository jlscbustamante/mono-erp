import { db } from "#app/config/database.ts";
import { Hono } from "hono";

export const supplier_router = new Hono().get("/get_one/:id", async (c) => {
  const id = c.req.param("id");
  const supplier = await db
    .selectFrom("inv_supplier")
    .selectAll()
    .where("id", "=", +id)
    .executeTakeFirstOrThrow();

  return c.json({
    message: "ok",
    data: supplier,
  });
});
