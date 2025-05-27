import { db } from "#app/config/database.ts";
import { AdmPaymentOrderSelect, AdmRequirementSelect } from "@scope/shared";

export const get_order = async (
  id: number
): Promise<{
  order: AdmPaymentOrderSelect;
  requirements: AdmRequirementSelect[];
}> => {
  const payment_order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  const requirements = await db
    .selectFrom("adm_requirement")
    .selectAll()
    .where("payment_order_id", "=", id)
    .execute();

  return {
    order: payment_order,
    requirements,
  };
};
