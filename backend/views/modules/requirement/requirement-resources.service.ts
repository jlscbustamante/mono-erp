import { db } from "#app/database.ts";
import { cashBanks, costCenters, finMoveCash, suppliers } from "@scope/pizzadb";
import { asc } from "drizzle-orm";

export class RequirementResourceService {
  async companies() {
    const data = await db.query.companies.findMany({});
    return data;
  }

  async costCenter() {
    const data = await db.query.costCenters.findMany({
      orderBy: asc(costCenters.costcenter),
    });
    return data;
  }

  async cashBank() {
    const data = await db.query.cashBanks.findMany({
      orderBy: asc(cashBanks.cashbank),
    });

    return data;
  }

  async suppliers() {
    const data = await db.query.suppliers.findMany({
      orderBy: asc(suppliers.supplier),
    });
    return data;
  }

  async movesCash() {
    const data = await db.query.finMoveCash.findMany({
      orderBy: asc(finMoveCash.movecash),
    });
    return data;
  }
}
