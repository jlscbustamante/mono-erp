import { zValidator } from "@hono/zod-validator";
import { DispatchUpdateDto } from "@scope/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  check_status,
  clear_logs,
  dispatch_multiple,
  stop_queue,
} from "./case/dispatch_order.ts";
import {
  dispatch_order_by_id_uc,
  dividerDispatchService,
  reset_dispatch_uc,
} from "./dependencies.ts";

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
      if (err?.code == "ENOENT") {
        data = {
          data: {},
        };
      }
      throw new HTTPException(400, { message: err.message });
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
  .post("dispatch_order", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as DispatchUpdateDto;
    const data = await dispatch_order_by_id_uc.execute_and_update(
      body,
      user.name
    );
    return c.json({ message: "ok", data });
  })
  .post("dispatch_order_id", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as {
      dispatch_id: number;
      date: string;
      warehouse_origin?: string;
    };
    await dispatch_order_by_id_uc.execute(
      body.dispatch_id,
      body.date,
      user.name,
      body.warehouse_origin
    );
    return c.json({ message: "ok" });
  })
  .post("reset_dispatch", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as {
      dispatch_id: number;
    };
    await reset_dispatch_uc.execute(body.dispatch_id, user.name);
    return c.json({ message: "ok" });
  })
  .post("dispatch_multiple", async (c) => {
    const props = (await c.req.json()) as {
      ids: number[];
      date: string;
      warehouse_origin?: string;
    };
    const user = c.get("user");

    dispatch_multiple(props.ids, props.date, user.name, props.warehouse_origin);

    return c.json({ message: "ok" });
  })
  .get("check_dispatches", async (c) => {
    const status = await check_status();
    return c.json({ message: "ok", data: status });
  })
  .get("clear_logs", async (c) => {
    await clear_logs();
    return c.json({ message: "ok" });
  })
  .post("stop_queue", async (c) => {
    await stop_queue();
    return c.json({ message: "ok" });
  });
