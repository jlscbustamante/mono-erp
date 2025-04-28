import { db } from "#app/config/database.ts";
import { transformWhere } from "@scope/pizzadb/filter";
import { WhereOption } from "@scope/pizzadb/types";
import { AdmRequirementSelect, RequirementViewDto } from "@scope/shared";
import { format } from "date-fns";
import { sql } from "kysely";

export const filter = async (
  filters: WhereOption<AdmRequirementSelect>[]
): Promise<RequirementViewDto[]> => {
  const query = transformWhere(filters, "rq").join(" AND ");

  const data = await sql`SELECT 
    rq.id,
    rq.legal_name,
    rq.legal_number,
    rq.num_document,
    rq.description,
    fc.id costcenter_id,
    fc.costcenter costcenter,
    fm.id movetype_id,
    fm.movetype movetype,
    rq.request_code,
    rq.requested_at,
    rq.amount,rq.money,
    rq.created_by,
    rq.expires_at,
    rq.status
  FROM adm_requirement rq
  LEFT JOIN fin_costcenter fc ON rq.costcenter_id = fc.id
  LEFT JOIN fin_movetype fm ON rq.movetype_id = fm.id
  WHERE ${sql.raw(query)}`.execute(db);

  const result = data.rows.map((row: any) => {
    return {
      id: row.id,
      code: row.request_code,
      supplier_name: row.legal_name,
      supplier_id: row.legal_number,
      doc: row.num_document,
      description: row.description,
      cost_center_id: row.costcenter_id,
      cost_center: row.costcenter,
      movetype_id: row.movetype_id,
      movetype: row.movetype,
      amount: row.amount,
      created_by: row.created_by,
      requested_at: format(new Date(row.requested_at), "yyyy-MM-dd"),
      expires_at: row.expires_at
        ? format(new Date(row.expires_at), "yyyy-MM-dd")
        : null,
      status: row.status,
    } satisfies RequirementViewDto;
  });

  return result;
};
