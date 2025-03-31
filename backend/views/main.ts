import { session } from "#app/middleware/session.middleware.ts";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { companyRouter } from "./modules/company/index.ts";
import { inventoryRouter } from "./modules/inventory/index.ts";
import { purchase_router } from "./modules/purchase/index.ts";

const app = new Hono();

export const apiRouter = app
  .use("/api/*", cors())
  .basePath("/api/view")
  .use(logger())
  .get("/", (c) => c.json({ message: "api view" }))
  .use(session)
  .route("inventory", inventoryRouter)
  .route("company", companyRouter)
  .route("purchase", purchase_router);

apiRouter.onError((err, c) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  return c.json({ message: err.message }, 500);
});

Deno.serve(
  {
    port: 8001,
  },
  apiRouter.fetch
);
