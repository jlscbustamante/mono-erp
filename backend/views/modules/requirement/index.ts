import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import {
  requirementResourceService,
  requirementService,
} from "#app/modules/requirement/dependencies.ts";
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
  .get("/resource/companies", async (c) => {
    const data = await requirementResourceService.companies();
    return c.json({ data });
  })
  .get("/resource/costCenters", async (c) => {
    const data = await requirementResourceService.costCenter();
    return c.json({ data });
  })
  .get("/createResources", async (c) => {
    const data = await requirementService.createResources();
    return c.json({ data });
  })
  .get("/resource/cashBanks", async (c) => {
    const data = await requirementResourceService.cashBank();
    return c.json({ data });
  });
