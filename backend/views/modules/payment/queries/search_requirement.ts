import { db } from "#app/config/database.ts";
import { AdmRequirementSelect, PAYMENT_STATUS } from "@scope/shared";

export const search_requirement = async ({
  ruc,
  legal_name,
  invoice_number: num_doc,
}: {
  ruc?: string;
  legal_name?: string;
  invoice_number?: string;
}): Promise<{
  supplier: {
    id: number;
    supplier: string;
    legal_number: string;
  } | null;
  related: AdmRequirementSelect[];
}> => {
  let query_supplier = db
    .selectFrom("inv_supplier")
    .select(["id", "supplier", "legal_number", "legal_name"]);

  if (legal_name) {
    query_supplier = query_supplier.where(
      "legal_name",
      "like",
      `%${legal_name}%`
    );
  } else if (ruc) {
    query_supplier = query_supplier.where("legal_number", "like", `%${ruc}%`);
  }
  let supplier;
  if (ruc || legal_name) {
    const result = await query_supplier.executeTakeFirst();
    if (!result) {
      // RETORNAR VACIO
      return {
        supplier: null,
        related: [],
      };
    }
    supplier = result;
  }

  let query_requirements = db.selectFrom("adm_requirement").selectAll();

  if (supplier) {
    query_requirements = query_requirements.where(
      "supplier_id",
      "=",
      supplier.id
    );
  }
  if (num_doc) {
    query_requirements = query_requirements.where(
      "num_document",
      "like",
      `%${num_doc}%`
    );
  }

  const requirements = await query_requirements
    .where("status", "=", PAYMENT_STATUS.APPROVED)
    .limit(20)
    .orderBy("id", "desc")
    .execute();

  return {
    supplier: supplier
      ? {
          id: supplier.id,
          supplier: supplier.legal_name ?? supplier.supplier,
          legal_number: supplier.legal_number ?? "",
        }
      : null,
    related: requirements,
  };
};
