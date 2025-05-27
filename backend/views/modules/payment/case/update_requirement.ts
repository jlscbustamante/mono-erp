import { db } from "#app/config/database.ts";
import { AdmRequirementSelect } from "@scope/shared";

export const update_requirement = async (data: AdmRequirementSelect) => {
  await db
    .updateTable("adm_requirement")
    .set(data)
    .where("id", "=", data.id)
    .execute();
};
