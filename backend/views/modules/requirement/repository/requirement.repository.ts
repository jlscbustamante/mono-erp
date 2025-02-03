import { db } from "#app/database.ts";
import { Requirement } from "#app/modules/requirement/entities/requirement.entity.ts";
import { companies, requirements } from "@scope/pizzadb";
import { transformWhere } from "@scope/pizzadb/filter";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";
import { aliasedTable, desc, eq, sql } from "drizzle-orm";

export class RequirementRepository {
  async filter(
    filters: WhereOption<RequirementSelect>[]
  ): Promise<Requirement[]> {
    const alias = aliasedTable(requirements, "req");
    const query = transformWhere(filters, "req").join(" AND ");

    const result = await db
      .select()
      .from(alias)
      .leftJoin(companies, eq(companies.id, alias.company_id))
      .limit(1)
      .where(query ? sql.raw(query) : undefined)
      .orderBy(desc(alias.created_at));

    console.log("result: ", result);

    // return result.map((el) => new Requirement(el));
    return [];
  }
}
