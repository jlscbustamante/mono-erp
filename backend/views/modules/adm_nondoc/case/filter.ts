import { db } from "#app/config/database.ts";
import { transformWhere } from "@scope/pizzadb/filter";
import { WhereOption } from "@scope/pizzadb/types";
import { AdmReqNondocsInsert, AdmReqNondocsViewDto } from "@scope/shared";
import { sql } from "kysely";

export const filter_nondocs = async (
  filters: WhereOption<AdmReqNondocsInsert>[]
): Promise<AdmReqNondocsViewDto[]> => {
  const query = transformWhere(filters, "arn").join(" AND ");

  let result;
  if (filters.length > 0) {
    const data = await sql`SELECT arn.*,fnc.cashbank cashbank_source_name,
      fnc2.cashbank cashbank_target_name FROM adm_req_nondocs arn
    LEFT JOIN fin_cashbank fnc ON arn.cashbank_source_id = fnc.id
    LEFT JOIN fin_cashbank fnc2 ON arn.cashbank_target_id = fnc2.id
     WHERE ${sql.raw(query)}`.execute(db);
    return data.rows as AdmReqNondocsViewDto[];
  } else {
    const data = await sql`SELECT arn.*,fnc.cashbank cashbank_source_name,
      fnc2.cashbank cashbank_target_name FROM adm_req_nondocs arn
    LEFT JOIN fin_cashbank fnc ON arn.cashbank_source_id = fnc.id
    LEFT JOIN fin_cashbank fnc2 ON arn.cashbank_target_id = fnc2.id`.execute(
      db
    );
    result = data.rows as AdmReqNondocsViewDto[];
  }

  return result.map((el) => el);
};
