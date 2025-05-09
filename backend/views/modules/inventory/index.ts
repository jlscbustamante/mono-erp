import { create_dispatch } from "#app/modules/inventory/case/create_dispatch.ts";
import { generate_guide } from "#app/modules/inventory/invoice/case/generate_guide.ts";
import { invoice_and_generate_guide } from "#app/modules/inventory/invoice/case/invoice_and_generate_guide.ts";
import { generate_invoice } from "#app/modules/inventory/invoice/case/invoice_dispatch.ts";
import { get_items_to_dispatch_by_warehouse } from "#app/modules/inventory/queries/get_template.ts";
import { zValidator } from "@hono/zod-validator";
import {
  DispatchCreateDto,
  DispatchItem,
  DispatchItemAddDto,
  DispatchUpdateDto,
  InvDispatchInsert,
  InvDispatchItemInsert,
  MoveBetweenStoresDto,
  TransportInfoDto,
} from "@scope/shared";
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
  delete_dispatch_uc,
  dispatch_exceptional_uc,
  dispatch_movement,
  dispatch_order_by_id_uc,
  dividerDispatchService,
  reset_dispatch_uc,
  update_dispatched_uc,
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
  .post("create_dispatch", zValidator("json", z.any()), async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json") as {
      dispatch: InvDispatchInsert;
      items: InvDispatchItemInsert[];
    };
    await create_dispatch({
      dispatch: body.dispatch,
      items: body.items,
      username: user.name,
    });

    return c.json({
      message: "ok",
    });
  })
  .post("dispatch_order", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as DispatchUpdateDto;
    await dispatch_order_by_id_uc.execute_and_update_wrapper(body, user.name);
    return c.json({ message: "ok" });
  })
  .delete("dispatch_order", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as { id: number; reason?: string };
    await delete_dispatch_uc.execute(body.id, user.name, body.reason);

    return c.json({ message: "ok" });
  })
  .put("update_dispatched", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as {
      dispatch_id: number;
      to_create: DispatchItemAddDto[];
      to_update: DispatchItem[];
      to_delete: DispatchItem[];
      tax_value: number;
    };

    await update_dispatched_uc.execute(body, user.name);

    return c.json({
      message: "ok",
    });
  })
  .post("dispatch_exceptional", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as DispatchCreateDto;
    await dispatch_exceptional_uc.execute(body, user.name);

    return c.json({ message: "ok" });
  })
  .post("dispatch_movement", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as MoveBetweenStoresDto;
    await dispatch_movement.execute(body, user.name);
    return c.json({ message: "ok" });
  })
  .delete("dispatch_movement", async (c) => {
    const user = c.get("user");
    const body = (await c.req.json()) as { id: number };
    await dispatch_movement.delete(body.id, user.name);
    return c.json({ message: "ok" });
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
  .get(
    "get_items_to_dispatch",
    zValidator(
      "query",
      z.object({
        warehouse_id: z.string(),
      })
    ),
    async (c) => {
      const { warehouse_id } = c.req.valid("query");
      const data = await get_items_to_dispatch_by_warehouse(warehouse_id);

      return c.json({
        message: "ok",
        data,
      });
    }
  )
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
  })
  // facturas
  .post(
    "/invoice/generate_invoice_and_guide",
    zValidator(
      "json",
      z.object({
        dispatch_id: z.number().int(),
        transport: z.any(),
      })
    ),
    async (c) => {
      const { dispatch_id, transport } = c.req.valid("json");
      await invoice_and_generate_guide(
        dispatch_id,
        transport as TransportInfoDto
      );

      return c.json({ message: "ok" });
    }
  )
  .post(
    "/invoice/generate_guide",
    zValidator(
      "json",
      z.object({
        dispatch_id: z.number().int(),
        transport: z.any(),
      })
    ),
    async (c) => {
      const { dispatch_id, transport } = c.req.valid("json");
      await generate_guide(dispatch_id, transport as TransportInfoDto);
      return c.json({
        message: "ok",
      });
    }
  )
  .post(
    "/invoice/generate_invoice",
    zValidator(
      "json",
      z.object({
        dispatch_id: z.number().int(),
      })
    ),
    async (c) => {
      const { dispatch_id } = c.req.valid("json");
      await generate_invoice(dispatch_id);
      return c.json({
        message: "ok",
      });
    }
  );
