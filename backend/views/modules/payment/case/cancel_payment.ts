import { db } from "#app/config/database.ts";
import { PAYMENT_STATUS } from "@scope/shared";

export const cancel_payment = async (id: number) => {
  await db
    .updateTable("adm_req_nondocs")
    .set({
      status: PAYMENT_STATUS.CANCELED,
    })
    .where("id", "=", id)
    .execute();
};
