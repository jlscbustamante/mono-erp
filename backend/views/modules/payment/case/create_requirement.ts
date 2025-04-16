import { db } from "#app/config/database.ts";
import { AdmRequirementInsert } from "@scope/shared";

export const create_requirement = async (data: AdmRequirementInsert) => {
  await db.insertInto("adm_requirement").values(data).execute();
};
