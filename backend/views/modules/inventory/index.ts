import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { dispatchOrderUC, dividerDispatchService } from "./dependencies.ts";

export const inventoryRouter = new Hono()
  .get("/items", (c) => {
    const user = c.get("user");
    return c.json({ message: "hi", data: user });
  })
  .get("/readDividerRelation", async (c) => {
    let data;
    try {
      data = await dividerDispatchService.readRelation();
    } catch (err: any) {
      if (err.code == "ENOENT") {
        data = {
          data: {},
        };
      }
    }

    return c.json(data);
  })
  .post(
    "/writeDividerRelation",
    zValidator(
      "json",
      z.object({
        data: z.record(z.string()),
      })
    ),
    async (c) => {
      const { data } = c.req.valid("json");

      await dividerDispatchService.writeRelation(data);

      return c.json({ message: "ok" }, 200);
    }
  )
  .post(
    "/divideDispatch",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.number().int()),
      })
    ),
    async (c) => {
      const { ids } = c.req.valid("json");
      await dividerDispatchService.execute(ids);
      return c.json({ message: "ok" }, 200);
    }
  )
  .post(
    "dispatchOrder",
    zValidator(
      "json",
      z.object({
        id: z.number().int(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("json");
      await dispatchOrderUC.execute(id);
      return c.json({ message: "ok" }, 200);
    }
  );
