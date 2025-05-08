import { redis } from "#app/config/redis.ts";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { session } from "./middleware/session.middleware.ts";
import { companyRouter } from "./modules/company/index.ts";
import { inventoryRouter } from "./modules/inventory/index.ts";
import { purchase_router } from "./modules/purchase/index.ts";

const app = new Hono();

export const apiRouter = app
  .use("/api/*", cors())
  .basePath("/api/view")
  .use(logger())
  .get("/", (c) => c.json({ message: "api view" }))
  .get("clear_cache", async (c) => {
    const key = c.req.query("key");
    if (key) {
      await redis.del(key);
      return c.json({ message: "ok" });
    }
    return c.json({ message: "key is required" }, 400);
  })
  .use(session)
  .route("inventory", inventoryRouter)
  .route("company", companyRouter)
  .route("purchase", purchase_router);

export type ViewType = typeof apiRouter;

apiRouter.onError((err, c) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  return c.json({ message: err.message }, 500);
});

const startTime = new Date().toLocaleString();
console.log(`API server started at ${startTime}`);

Deno.serve(
  {
    port: 8001,
  },
  apiRouter.fetch
);
