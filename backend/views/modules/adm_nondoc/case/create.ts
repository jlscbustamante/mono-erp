import { db } from "#app/config/database.ts";
import { generate_identifier } from "#app/modules/payment/case/generate_indentifier.ts";
import { AdmReqNondocsInsert } from "@scope/shared";

export const create_nondoc = async (
  data: AdmReqNondocsInsert,
  username: string
) => {
  const identifier = generate_identifier();
  await db
    .insertInto("adm_req_nondocs")
    .values({
      ...data,
      request_type: "T",
      requested_at: new Date(),
      request_code: identifier,
      created_by: username,
    })
    .execute();
};
