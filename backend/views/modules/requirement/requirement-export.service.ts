import { db } from "#app/database.ts";
import { transformWhere } from "@scope/pizzadb/filter";
import type {
  RequirementRelationsSelect,
  RequirementSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import { sql } from "drizzle-orm";

export class RequirementExportService {
  async exportExcel(filters: WhereOption<RequirementSelect>[]) {
    const query = transformWhere(filters).join(" AND ");

    const result: RequirementRelationsSelect[] =
      await db.query.requirements.findMany({
        where: query ? sql.raw(query) : undefined,
        with: {
          items: true,
          supplier: true,
        },
      });
    return result;
  }
}
