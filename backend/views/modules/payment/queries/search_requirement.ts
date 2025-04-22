import { db } from "#app/config/database.ts";
import { AdmRequirementSelect, PAYMENT_STATUS } from "@scope/shared";

export const search_requirement = async ({
  ruc,
  legal_name,
  invoice_number,
}: {
  ruc?: string;
  legal_name?: string;
  invoice_number?: string;
}): Promise<AdmRequirementSelect> => {
  let query = db.selectFrom("adm_requirement").selectAll();

  if (ruc) {
    query = query.where("legal_number", "like", `%${ruc}%`);
  }
  if (legal_name) {
    query = query.where("legal_name", "like", `%${legal_name}%`);
  }
  if (invoice_number) {
    query = query.where("num_document", "like", `%${invoice_number}%`);
  }

  const requirement = await query
    .where("status", "=", PAYMENT_STATUS.APPROVED)
    .orderBy("adm_requirement.requested_at", "desc")
    .limit(1)
    .executeTakeFirstOrThrow();

  return requirement;
};
