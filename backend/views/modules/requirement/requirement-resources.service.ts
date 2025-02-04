import { db } from "#app/database.ts";

export class RequirementResourceService {
  async companies() {
    const data = await db.query.companies.findMany({});
    return data;
  }

  async costCenter() {
    const data = await db.query.costCenters.findMany({});
    return data;
  }

  async cashBank() {
    const data = await db.query.cashBanks.findMany({});

    return data;
  }
}
