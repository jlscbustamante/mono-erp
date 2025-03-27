import { CompanyService } from "#app/modules/company/company.service.ts";
import { Hono } from "hono";

const companyService = new CompanyService();

export const companyRouter = new Hono().get("/", async (c) => {
  const data = await companyService.getCompanies();

  return c.json({
    message: "ok",
    data,
  });
});
