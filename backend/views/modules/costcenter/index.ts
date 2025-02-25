import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { costCenterRepository } from "#app/modules/costcenter/dependencies.ts";
import { CostCenterSelecet, WhereOption } from "@scope/pizzadb/types";
import { Hono } from "hono";

export const costCenterRouter = new Hono().get(
  "/filter",
  filtersMiddlaware,
  async (c) => {
    const filters = c.get("filters") as WhereOption<CostCenterSelecet>[];

    const data = await costCenterRepository.filter(filters);
    return c.json({
      data,
    });
  }
);
