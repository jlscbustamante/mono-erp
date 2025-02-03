import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { requirementService } from "#app/modules/requirement/dependencies.ts";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";
import { Hono } from "hono";

export const requirementRouter = new Hono()
  .get("/filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<RequirementSelect>[];

    const data = await requirementService.filter(filters);

    return c.json({
      data,
    });
  })
  .get("/createResources", async (c) => {
    const data = await requirementService.createResources();
    return c.json({ data });
  });
