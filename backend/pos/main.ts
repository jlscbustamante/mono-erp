import { format } from "date-fns";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { invetarioRouter } from "./router/inventario.ts";

const app = new Hono();

app
  .use(cors())
  .use(async (c, next) => {
    console.log(
      `[${c.req.method}] ${c.req.path} ${format(
        new Date(),
        "yyyy-MM-dd HH:mm:ss"
      )}`
    );
    await next();
  })
  .basePath("/api/xpos")
  .get("/", (c) => c.json({ message: "api pos" }))
  .route("inventario", invetarioRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  c.status(500);
  return c.json({
    error: err.message,
  });
});

Deno.serve(
  {
    port: 8004,
  },
  app.fetch
);
