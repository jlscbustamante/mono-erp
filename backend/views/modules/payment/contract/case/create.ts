import { db } from "#app/config/database.ts";
import { AdmReqContractInsert } from "@scope/shared";

export const create_contract = async (values: AdmReqContractInsert) => {
  await db
    .insertInto("adm_req_contract")
    .values({
      ...values,
      status: "N",
    })
    .execute();
};
