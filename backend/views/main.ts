import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { session } from "./middleware/session.middleware.ts";
import { inventoryRouter } from "./modules/inventory/index.ts";

const app = new Hono();

export const apiRouter = app
  .basePath("/api/view")
  .use(cors())
  .get("/", (c) => c.json({ message: "api view" }))
  .use(session)
  .route("inventory", inventoryRouter);

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
