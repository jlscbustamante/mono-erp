import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { approve_requirement } from "#app/modules/payment/case/approve.ts";
import { create_requirement } from "#app/modules/payment/case/create_requirement.ts";
import { filter } from "#app/modules/payment/case/filter.ts";
import { update_requirement } from "#app/modules/payment/case/update_requirement.ts";
import { get_one } from "#app/modules/payment/queries/get_one.ts";
import { zValidator } from "@hono/zod-validator";
import { AdmRequirementInsert } from "@scope/shared";
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
  });
