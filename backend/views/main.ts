import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { session } from "./middleware/session.middleware.ts";
import { admNondocRouter } from "./modules/adm_nondoc/index.ts";
import { authRouter } from "./modules/auth/index.ts";
import { cashBankRouter } from "./modules/cashbank/index.ts";
import { costCenterRouter } from "./modules/costcenter/index.ts";
import { inventoryRouter } from "./modules/inventory/index.ts";
import { paymentRouter } from "./modules/payment/index.ts";
import { requirementRouter } from "./modules/requirement/index.ts";

const app = new Hono();

export const apiRouter = app
  .use("/api/*", cors())
  .basePath("/api/view")
  .use(session)
  .use(logger())
  .get("/", (c) => c.json({ message: "api view" }))
  .route("inventory", inventoryRouter)
  .route("auth", authRouter)
  .route("requirement", requirementRouter)
  .route("costcenter", costCenterRouter)
  .route("cashbank", cashBankRouter)
  .route("payment", paymentRouter)
  .route("nondoc", admNondocRouter);

apiRouter.onError((err, c) => {
  // console.log(err);
  console.log(`ERROR : ${err.message}`);
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
