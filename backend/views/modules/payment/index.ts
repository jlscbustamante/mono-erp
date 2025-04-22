import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { approve_requirement } from "#app/modules/payment/case/approve.ts";
import { create_requirement } from "#app/modules/payment/case/create_requirement.ts";
import { filter } from "#app/modules/payment/case/filter.ts";
import { create_order } from "#app/modules/payment/case/order/create_order.ts";
import { update_requirement } from "#app/modules/payment/case/update_requirement.ts";
import { filter_orders } from "#app/modules/payment/queries/filter_orders.ts";
import { get_one } from "#app/modules/payment/queries/get_one.ts";
import { get_order } from "#app/modules/payment/queries/get_order.ts";
import { search_requirement } from "#app/modules/payment/queries/search_requirement.ts";
import { zValidator } from "@hono/zod-validator";
import { AdmRequirementInsert, CreateOrderDto } from "@scope/shared";
import { Hono } from "hono";
import { z } from "zod";

export const paymentRouter = new Hono()
  .post("create_requirement", zValidator("json", z.any()), async (c) => {
    const valid = c.req.valid("json") as AdmRequirementInsert;
    const user = c.get("user");

    await create_requirement(valid, user.name);

    return c.json({
      message: "ok",
      data: valid,
    });
  })
  .get("filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters");
    const data = await filter(filters);
    return c.json({
      message: "ok",
      data,
    });
  })
  .get("get_one", async (c) => {
    const { id } = c.req.query();
    const data = await get_one(Number(id));
    return c.json({
      message: "ok",
      data,
    });
  })
  .put("update_requirement", async (c) => {
    const data = await c.req.json();
    await update_requirement(data);

    return c.json({
      message: "ok",
    });
  })
  .put("approve_requirement", async (c) => {
    const data = await c.req.json();
    await approve_requirement(data);

    return c.json({
      message: "ok",
    });
  })
  .post("order", zValidator("json", z.any()), async (c) => {
    const data = c.req.valid("json") as CreateOrderDto;
    const user = c.get("user");
    await create_order(data, user.name);

    return c.json({
      message: "ok",
    });
  })
  .get(
    "order",
    zValidator(
      "query",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("query");
      const requirement = await get_order(+id);
      return c.json({
        message: "ok",
        data: requirement,
      });
    }
  )
  .get(
    "search_requirement",
    zValidator(
      "query",
      z.object({
        ruc: z.string().optional(),
        legal_name: z.string().optional(),
        invoice_number: z.string().optional(),
      })
    ),
    async (c) => {
      const { ruc, legal_name, invoice_number } = c.req.valid("query");

      const requirement = await search_requirement({
        ruc,
        legal_name,
        invoice_number,
      });

      return c.json({
        message: "ok",
        data: requirement,
      });
    }
  )
  .get("filter_orders", filtersMiddlaware, async (c) => {
    const filters = c.get("filters");
    const data = await filter_orders(filters);

    return c.json({
      message: "ok",
      data,
    });
  });
