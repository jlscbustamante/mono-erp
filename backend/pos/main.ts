import { Hono } from "hono";
import { cors } from "hono/cors";
import { invetarioRouter } from "./router/inventario.ts";

const app = new Hono();

app
  .use("/api/*", cors())
  .basePath("/api/xpos")
  .get("/", (c) => c.json({ message: "api pos" }))
  .route("inventario", invetarioRouter);

Deno.serve(
  {
    port: 8004,
  },
  app.fetch
);
