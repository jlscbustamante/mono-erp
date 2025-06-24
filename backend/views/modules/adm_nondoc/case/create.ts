import { db } from "#app/config/database.ts";
import {
  AdmTypeIdentifier,
  generate_adm_identifier,
} from "#app/modules/payment/common/generate_adm_identifier.ts";
import { AdmReqNondocsInsert, PAYMENT_STATUS } from "@scope/shared";

export const create_nondoc = async (
  data: AdmReqNondocsInsert,
  username: string,
  type: string
) => {
  const identifier = await generate_adm_identifier(
    data.request_type as AdmTypeIdentifier
  );

  await db
    .insertInto("adm_req_nondocs")
    .values({
      ...data,
      status: PAYMENT_STATUS.APPROVED,
      request_type: type,
      requested_at: new Date(),
      request_code: identifier,
      created_by: username,
    })
    .execute();
};
