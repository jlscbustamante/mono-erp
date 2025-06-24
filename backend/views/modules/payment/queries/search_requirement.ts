import { db } from "#app/config/database.ts";
import { IAdmRequirementWithSupplierBank, PAYMENT_STATUS } from "@scope/shared";
import { InvSupplierSelect } from "../../../../shared/db/mods.ts";

export const search_requirement = async ({
  ruc,
  legal_name,
  invoice_number: num_doc,
}: {
  ruc?: string;
  legal_name?: string;
  invoice_number?: string;
}): Promise<{
  supplier: InvSupplierSelect | null;
  related: IAdmRequirementWithSupplierBank[];
}> => {
  let query_supplier = db.selectFrom("inv_supplier").selectAll();

  if (legal_name) {
    query_supplier = query_supplier.where(
      "legal_name",
      "like",
      `%${legal_name}%`
    );
  } else if (ruc) {
    query_supplier = query_supplier.where("legal_number", "like", `%${ruc}%`);
  }
  let supplier: InvSupplierSelect | undefined = undefined;
  if (ruc || legal_name) {
    const result: InvSupplierSelect | undefined =
      await query_supplier.executeTakeFirst();
    if (!result) {
      // RETORNAR VACIO
      return {
        supplier: null,
        related: [],
      };
    }
    supplier = result;
  }

  let query_requirements = db.selectFrom("adm_requirement");

  if (supplier) {
    query_requirements = query_requirements.where(
      "adm_requirement.supplier_id",
      "=",
      supplier.id
    );
  }
  if (num_doc) {
    query_requirements = query_requirements.where(
      "adm_requirement.num_document",
      "like",
      `%${num_doc}%`
    );
  }

  const requirements = await query_requirements
    .where("adm_requirement.status", "=", PAYMENT_STATUS.REGISTERED)
    .leftJoin("inv_supplier", "adm_requirement.supplier_id", "inv_supplier.id")
    .selectAll("adm_requirement")
    .select([
      "inv_supplier.bank_name",
      "inv_supplier.bank_code",
      "inv_supplier.bank_account_num",
      "inv_supplier.bank_account_cci",
      "inv_supplier.bank_account_type",
    ])
    .limit(20)
    .orderBy("adm_requirement.id", "desc")
    .execute();

  return {
    supplier: supplier ? supplier : null,
    related: requirements,
  };
};
