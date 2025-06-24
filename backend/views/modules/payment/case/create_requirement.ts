import { db } from "#app/config/database.ts";
import {
  AdmTypeIdentifier,
  generate_adm_identifier,
} from "#app/modules/payment/common/generate_adm_identifier.ts";
import { AdmRequirementInsert, PAYMENT_STATUS } from "@scope/shared";

export const create_requirement = async (
  data: AdmRequirementInsert,
  username: string
) => {
  if (!data.supplier_id && data.legal_number) {
    throw new Error("Supplier ID es requerido cuando se proporciona ruc");
  }
  const identifier = await generate_adm_identifier(AdmTypeIdentifier.INVOICE);
  const new_requirement: AdmRequirementInsert = {
    ...data,
    requested_at: new Date(),
    request_code: identifier,
    created_by: username,
    status: PAYMENT_STATUS.REGISTERED,
  };
  await db.insertInto("adm_requirement").values(new_requirement).execute();
};
