import { Hono } from "hono";
/*import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
*/

export const recipeRouter = new Hono().get("/filter/insumos", (c) => {
  return c.json({ resp: "Ok" });
});
