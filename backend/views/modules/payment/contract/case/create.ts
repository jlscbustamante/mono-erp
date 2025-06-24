import { db } from "#app/config/database.ts";
import {
  AdmTypeIdentifier,
  generate_adm_identifier,
} from "#app/modules/payment/common/generate_adm_identifier.ts";
import {
  AdmReqContractInsert,
  CONTRACT_STATUS,
  get_contract_status_name,
} from "@scope/shared";

export const create_contract = async (values: AdmReqContractInsert) => {
  const code = await generate_adm_identifier(AdmTypeIdentifier.CONTRACT);
  await db
    .insertInto("adm_req_contract")
    .values({
      ...values,
      status: CONTRACT_STATUS.INGRESADO,
      status_name: get_contract_status_name(CONTRACT_STATUS.INGRESADO),
      contract_code: code,
    })
    .execute();
};
