import { db } from "#app/config/database.ts";
import {
  AdmPaymentOrderSelect,
  IAdmRequirementWithSupplierBank,
} from "@scope/shared";

export const get_order = async (
  id: number
): Promise<{
  order: AdmPaymentOrderSelect;
  requirements: IAdmRequirementWithSupplierBank[];
}> => {
  const payment_order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  const requirements = await db
    .selectFrom("adm_requirement")
    .leftJoin("inv_supplier", "adm_requirement.supplier_id", "inv_supplier.id")
    .selectAll("adm_requirement")
    .select([
      "inv_supplier.bank_name",
      "inv_supplier.bank_code",
      "inv_supplier.bank_account_num",
      "inv_supplier.bank_account_cci",
      "inv_supplier.bank_account_type",
    ])
    .where("payment_order_id", "=", id)
    .execute();

  return {
    order: payment_order,
    requirements,
  };
};
