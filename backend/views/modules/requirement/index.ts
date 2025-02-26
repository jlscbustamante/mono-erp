import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import {
  requirementResourceService,
  requirementService,
} from "#app/modules/requirement/dependencies.ts";
import { REQUIREMENT_STATUS } from "#app/modules/requirement/interfaces/enums.ts";
import { UpdateRequirementDto } from "#app/modules/types/index.ts";
import { zValidator } from "@hono/zod-validator";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";
import { Hono } from "hono";
import { z } from "zod";

export const requirementRouter = new Hono()
  .get("/filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<RequirementSelect>[];

    const data = await requirementService.filter(filters);

    return c.json({
      data,
    });
  })
  .get(
    "/requirement/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const id = +c.req.param("id");
      const data = await requirementService.getRequirement(id);
      return c.json({ data });
    }
  )
  .get("/resource/companies", async (c) => {
    const data = await requirementResourceService.companies();
    return c.json({ data });
  })
  .get("/resource/costCenters", async (c) => {
    const data = await requirementResourceService.costCenter();
    return c.json({ data });
  })
  .post("/resource/costCenters/create", async (c) => {
    const costCenterCreate = await c.req.json();
    await requirementResourceService.createCostCenter(costCenterCreate);
    return c.json({ message: "ok" });
  })
  .post("/resource/costCenters/update", async (c) => {
    const costCenterCreate = await c.req.json();
    await requirementResourceService.updateCostCenter(costCenterCreate);
    return c.json({ message: "ok" });
  })

  .get("/resource/cashBanks", async (c) => {
    const data = await requirementResourceService.cashBank();
    return c.json({ data });
  })
  .get("/resource/suppliers", async (c) => {
    const data = await requirementResourceService.suppliers();
    return c.json({ data });
  })
  .get("resource/movescash", async (c) => {
    const data = await requirementResourceService.movesCash();
    return c.json({ data });
  })
  .get("resource/stores", async (c) => {
    const data = await requirementResourceService.stores();
    return c.json({ data });
  })
  .post("/create", async (c) => {
    const session = c.get("user");
    const data = await c.req.json();
    await requirementService.createRequirement(data, session.name);
    return c.json({
      message: "ok",
    });
  })
  .post("/approve", async (c) => {
    const session = c.get("user");
    const data = await c.req.json();

    await requirementService.approve(data.id as number, session.name);

    return c.json({
      message: "ok",
    });
  })
  .put("/save", async (c) => {
    // const session = c.get("user");
    const data = await c.req.json();

    await requirementService.saveRequirement(
      data as UpdateRequirementDto
      // session.name
    );
    return c.json({
      message: "ok",
    });
  })
  .put(
    "/undoApproval/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = +c.req.valid("param").id;
      await requirementService.undoApproval(id);
      return c.json({ message: "ok" });
    }
  )
  .get(
    "/requirementRelated/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = +c.req.valid("param").id;
      const data = await requirementService.getRelatedRequirements(id);
      return c.json({ data });
    }
  )
  .post(
    "/rejectRequirement",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.number()),
      })
    ),
    async (c) => {
      const { ids } = c.req.valid("json");

      await requirementService.rejectRequirements(ids);

      return c.json({ message: "ok" });
    }
  )
  .get(
    "/requirementAmountsMonth",
    zValidator(
      "query",
      z.object({
        filters: z.string().optional(),
        month: z.string(),
        status: z.union([
          z.enum([
            REQUIREMENT_STATUS.APPROVED,
            REQUIREMENT_STATUS.PENDING,
            REQUIREMENT_STATUS.PAID,
            REQUIREMENT_STATUS.CANCELLED,
          ]),
          z.array(
            z.enum([
              REQUIREMENT_STATUS.APPROVED,
              REQUIREMENT_STATUS.PENDING,
              REQUIREMENT_STATUS.PAID,
              REQUIREMENT_STATUS.CANCELLED,
            ])
          ),
        ]),
      })
    ),
    async (c) => {
      const { month, status, filters } = c.req.valid("query");
      const requirementFilters: WhereOption<RequirementSelect>[] = filters
        ? JSON.parse(filters)
        : undefined;
      const statusArr = typeof status == "string" ? [status] : status;
      const data = await requirementService.requirementAmountsMont(
        month,
        statusArr,
        requirementFilters
      );

      return c.json({ message: "ok", data });
    }
  );
