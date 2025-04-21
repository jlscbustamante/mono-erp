import { db } from "#app/config/database.ts";
import { AdmRequirementSelect, PAYMENT_STATUS } from "@scope/shared";

export const approve_requirement = async (data: AdmRequirementSelect) => {
  await db
    .updateTable("adm_requirement")
    .set({
      ...data,
      status: PAYMENT_STATUS.APPROVED,
    })
    .where("id", "=", data.id)
    .execute();
};
