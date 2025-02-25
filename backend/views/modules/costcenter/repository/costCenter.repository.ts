import { db } from "#app/database.ts";
import { transformWhere } from "@scope/pizzadb/filter";
import { CostCenterSelecet, WhereOption } from "@scope/pizzadb/types";
import { sql } from "drizzle-orm";

export class CostCenterRepository {
  async filter(
    filters: WhereOption<CostCenterSelecet>[]
  ): Promise<CostCenterSelecet[]> {
    const query = transformWhere(filters).join(" AND ");

    const result: CostCenterSelecet[] = await db.query.costCenters.findMany({
      where: query ? sql.raw(query) : undefined,
      limit: 500,
    });

    return result;
  }
}
