import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { filter_nondocs } from "#app/modules/adm_nondoc/case/filter.ts";
import { zValidator } from "@hono/zod-validator";
import { AdmReqNondocsInsert } from "@scope/shared";
import { Hono } from "hono";
import { z } from "zod";
import { create_nondoc } from "./case/create.ts";

export const admNondocRouter = new Hono()
  .post("requirement/transfer", zValidator("json", z.any()), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json") as AdmReqNondocsInsert;
    await create_nondoc(data, user.name, "T");
    return c.json({
      message: "ok",
    });
  })
  .post("requirement/prepayment", zValidator("json", z.any()), async (c) => {
    const user = c.get("user");
    const data = (await c.req.valid("json")) as AdmReqNondocsInsert;
    await create_nondoc(data, user.name, "P");
    return c.json({
      message: "ok",
    });
  })
  .get("filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters");
    const data = await filter_nondocs(filters);

    return c.json({
      message: "ok",
      data,
    });
  })
  .get(
    "get_one",
    zValidator(
      "query",
      z.object({
        id: z.number().min(1),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("query");
      return c.json({ message: "ok" });
    }
  );
