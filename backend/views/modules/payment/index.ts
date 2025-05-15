import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { add_authorized_user } from "#app/modules/payment/case/add_authorized_user.ts";
import { approve_requirement } from "#app/modules/payment/case/approve.ts";
import { authorize_order } from "#app/modules/payment/case/authorize_order.ts";
import { create_requirement } from "#app/modules/payment/case/create_requirement.ts";
import { delete_authorized_user } from "#app/modules/payment/case/delete_authorized_user.ts";
import {
  filter,
  get_requirements_by_ids,
} from "#app/modules/payment/case/filter.ts";
import { create_order } from "#app/modules/payment/case/order/create_order.ts";
import { delete_order } from "#app/modules/payment/case/order/delete_order.ts";
import { check_user } from "#app/modules/payment/case/security/check_user.ts";
import { update_requirement } from "#app/modules/payment/case/update_requirement.ts";
import { generate_payment } from "#app/modules/payment/host_to_host/generate_payment.ts";
import { filter_orders } from "#app/modules/payment/queries/filter_orders.ts";
import { get_authorized_users } from "#app/modules/payment/queries/get_authorized_users.ts";
import { get_one } from "#app/modules/payment/queries/get_one.ts";
import { get_order } from "#app/modules/payment/queries/get_order.ts";
import { search_requirement } from "#app/modules/payment/queries/search_requirement.ts";
import { zValidator } from "@hono/zod-validator";
import {
  AdmRequirementInsert,
  CreateOrderDto,
  ICreateMockAuthorizedUserDto,
} from "@scope/shared";
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
  .delete(
    "order",
    zValidator(
      "json",
      z.object({
        id: z.number(),
        delete_related: z.boolean(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      await delete_order(data.id, data.delete_related);
      return c.json({
        message: "ok",
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

      const data = await search_requirement({
        ruc,
        legal_name,
        invoice_number,
      });

      return c.json({
        message: "ok",
        data,
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
  })
  .get(
    "generate_payment",
    zValidator(
      "query",
      z.object({
        order_id: z.string(),
      })
    ),
    async (c) => {
      const { order_id } = c.req.valid("query");
      const data = await generate_payment(+order_id);
      return c.json({
        message: "ok",
        data,
      });
    }
  )
  .get(
    "get_requirements_by_ids",
    zValidator(
      "query",
      z.object({
        ids: z.string(),
      })
    ),
    async (c) => {
      const { ids } = c.req.valid("query");
      const ids_array = ids.split(",").map((id) => parseInt(id));

      const data = await get_requirements_by_ids(ids_array);

      return c.json({
        message: "ok",
        data,
      });
    }
  )
  .get("/order/authorized_user", async (c) => {
    const users = await get_authorized_users();
    return c.json({
      message: "ok",
      data: users,
    });
  })
  .post("/order/authorized_user", zValidator("json", z.any()), async (c) => {
    const new_user = (await c.req.valid(
      "json"
    )) as ICreateMockAuthorizedUserDto;
    add_authorized_user(new_user);
    return c.json({
      message: "ok",
    });
  })
  .delete(
    "/order/authorized_user",
    zValidator(
      "json",
      z.object({
        id: z.number(),
      })
    ),
    (c) => {
      const { id } = c.req.valid("json");
      delete_authorized_user(id);
      return c.json({
        message: "ok",
      });
    }
  )
  .post(
    "/order/authorize",
    zValidator(
      "json",
      z.object({
        order_id: z.number(),
        otp: z.string(),
        user: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { order_id, otp, user, password } = c.req.valid("json");
      await authorize_order({
        order_id,
        otp,
        user,
        password,
      });
      return c.json({
        message: "ok",
      });
    }
  )
  .post(
    "/security/check_user",
    zValidator(
      "json",
      z.object({
        user: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { user, password } = c.req.valid("json");
      const is_valid = await check_user(user, password);

      return c.json({
        message: "ok",
        data: is_valid,
      });
    }
  );
