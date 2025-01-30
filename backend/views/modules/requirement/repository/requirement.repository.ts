import { db } from "#app/database.ts";
import { Requirement } from "#app/modules/requirement/entities/requirement.entity.ts";
import { requirements } from "@scope/pizzadb";
import { transformWhere } from "@scope/pizzadb/filter";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";
import { aliasedTable, desc, sql } from "drizzle-orm";

export class RequirementRepository {
  async filter(filters: WhereOption<RequirementSelect>[]) {
    const alias = aliasedTable(requirements, "req");
    const query = transformWhere(filters, "req").join(" AND ");

    const result = await db
      .select()
      .from(alias)
      .limit(10)
      .where(query ? sql.raw(query) : undefined)
      .orderBy(desc(alias.created_at));

    return result.map((el) => new Requirement(el));
  }
}
