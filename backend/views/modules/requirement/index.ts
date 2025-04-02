import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import {
  requirementExportService,
  requirementResourceService,
  requirementService,
} from "#app/modules/requirement/dependencies.ts";
import { REQUIREMENT_STATUS } from "#app/modules/requirement/interfaces/enums.ts";
import { UpdateTransferRequirementDto } from "#app/modules/requirement/interfaces/update-requirement.dto.ts";
import { UpdateRequirementDto } from "#app/modules/types/index.ts";
import { zValidator } from "@hono/zod-validator";
import type {
  RequirementItemSelect,
  RequirementSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import * as XLSX from "xlsx";
import { z } from "zod";

export const requirementRouter = new Hono()
  .get("/filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<RequirementSelect>[];

    const data = await requirementService.filter(filters);

    return c.json({
      data,
    });
  })
  .get("/filterCount", filtersMiddlaware, async (c) => {
    const month = c.req.query().month;
    const count = await requirementService.filterCount(
      c.get("filters") as WhereOption<RequirementSelect>[],
      month ? +month : undefined
    );
    return c.json({
      data: count,
    });
  })
  .get(
    "/requirement/raw/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const id = +c.req.valid("param").id;
      const data = await requirementService.get_requirement_raw(id);

      return c.json({ message: "ok", data });
    }
  )
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
  .get("resource/movescash", async (c) => {
    const data = await requirementResourceService.movesCash();
    return c.json({ data });
  })
  .put("resource/movescash/update", async (c) => {
    const movecash = await c.req.json();
    await requirementResourceService.updateCategory(movecash);
    return c.json({ message: "ok" });
  })
  .post("/resource/movescash/create", async (c) => {
    const movecashcreate = await c.req.json();
    await requirementResourceService.createCategory(movecashcreate);
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
  .put("/save_transfer", async (c) => {
    const data = await c.req.json();

    await requirementService.saveTransferRequirement(
      data as UpdateTransferRequirementDto
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
  )
  .post("/create_transfer", async (c) => {
    const session = c.get("user");
    const data = await c.req.json();
    await requirementService.createTransfer(data, session.name);
    return c.json({
      message: "ok",
    });
  })
  .get("/report/detailed", async (c) => {
    const { date, cashAccountId } = c.req.query() as {
      date: string;
      cashAccountId: string;
    };
    const data = await requirementService.getDetailedReport(
      date,
      +cashAccountId
    );

    return c.json({
      message: "ok",
      data,
    });
  })
  .get("/report/initial_balance", async (c) => {
    const { date, cashId } = c.req.query() as {
      date: string;
      cashId: string;
    };

    const amount = await requirementService.getInitialBalance(+cashId, date);

    return c.json({
      message: "ok",
      data: amount,
    });
  })
  .get("/report/supplier_current_account", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<RequirementSelect>[];
    const data = await requirementService.getSupplierCurrentAccount(filters);
    return c.json({
      message: "ok",
      data,
    });
  })
  .get("/report/export", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<RequirementSelect>[];
    const data = await requirementExportService.exportExcel(filters);

    return stream(c, async (stream) => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      c.header("Content-Disposition", "attachment; filename=report.xlsx");
      c.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await stream.write(excelBuffer);
    });
  })
  .get(
    "/report/summary",
    zValidator(
      "query",
      z.object({
        date: z.string(),
        cashId: z.string(),
      })
    ),
    async (c) => {
      const { cashId, date } = c.req.valid("query");
      const data = await requirementService.resumeCashBox(+cashId, date);
      return c.json({
        message: "ok",
        data,
      });
    }
  )
  .get(
    "/report/cost_center",
    zValidator(
      "query",
      z.object({
        start: z.string(),
        end: z.string(),
        company_id: z.string().optional(),
      })
    ),
    async (c) => {
      const { end, start, company_id } = c.req.valid("query");
      const data = await requirementService.requirements_by_cost_center(
        start,
        end,
        company_id
      );
      return c.json({
        message: "ok",
        data,
      });
    }
  )
  .put("/update_requirement", async (c) => {
    const data: {
      item: RequirementItemSelect;
      requirement: RequirementSelect;
    } = await c.req.json();
    await requirementService.updateRequirement(data);
    return c.json({
      message: "ok",
    });
  });
