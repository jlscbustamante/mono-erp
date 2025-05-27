import { filtersMiddlaware } from "#app/middleware/session.middleware.ts";
import { cashbankService } from "#app/modules/cashbank/dependencies.ts";
import { CreateCashBankDto } from "#app/modules/cashbank/interfaces/create-cashbank.dto.ts";
import { get_all_cashbanks } from "#app/modules/cashbank/queries/get_all_cashbanks.ts";
import { CashBankSelect, WhereOption } from "@scope/pizzadb/types";
import { Hono } from "hono";

export const cashBankRouter = new Hono()
  .get("/", async (c) => {
    const data = await get_all_cashbanks();
    return c.json({
      message: "ok",
      data,
    });
  })
  .get("/filter", filtersMiddlaware, async (c) => {
    const filters = c.get("filters") as WhereOption<CashBankSelect>[];

    const data = await cashbankService.filter(filters);

    return c.json({ data });
  })
  .post("/create", async (c) => {
    const data = (await c.req.json()) as CreateCashBankDto;
    await cashbankService.create(data);
    return c.json({ message: "ok" });
  })
  .put("/update", async (c) => {
    const data = (await c.req.json()) as CashBankSelect;
    await cashbankService.update(data);
    return c.json({ message: "ok" });
  });
