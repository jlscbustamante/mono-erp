import { db } from "#app/database.ts";
import { desc } from "drizzle-orm";
import { trademarkTable } from "../../../pizzadb/index.ts";

export class CompanyService {
  async getCompanies() {
    const companies = await db.query.trademarkTable.findMany({
      orderBy: desc(trademarkTable.title),
    });

    return companies;
  }
}
