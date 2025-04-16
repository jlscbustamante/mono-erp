import { create_requirement } from "#app/modules/payment/case/create_requirement.ts";
import { zValidator } from "@hono/zod-validator";
import { AdmRequirementInsert } from "@scope/shared";
import { Hono } from "hono";
import { z } from "zod";

export const paymentRouter = new Hono().post(
  "create_requirement",
  zValidator("json", z.any()),
  async (c) => {
    const valid = c.req.valid("json") as AdmRequirementInsert;

    await create_requirement(valid);

    return c.json({
      message: "ok",
      data: valid,
    });
  }
);
