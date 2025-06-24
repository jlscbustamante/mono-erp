import { db } from "#app/config/database.ts";
import {
  AdmTypeIdentifier,
  generate_adm_identifier,
} from "#app/modules/payment/common/generate_adm_identifier.ts";
import {
  CreateOrderDto,
  ORDER_PAYMENT_STATUS,
  PAYMENT_STATUS,
} from "@scope/shared";

export const create_order = async (data: CreateOrderDto, username: string) => {
  const { requirement_ids, ...payment_order } = data;
  const code = await generate_adm_identifier(AdmTypeIdentifier.ORDER);
  await db.transaction().execute(async (trx) => {
    const result = await trx
      .insertInto("adm_payment_order")
      .values({
        ...payment_order,
        status: ORDER_PAYMENT_STATUS.REGISTERED,
        required_at: new Date(),
        required_by: username,
        payment_code: code,
      })
      .execute();
    const insertId = result[0].insertId;
    if (!insertId) {
      throw new Error("Error inserting payment order");
    }

    await trx
      .updateTable("adm_requirement")
      .set({
        status: PAYMENT_STATUS.SCHEDULED,
        payment_order_id: Number(insertId),
      })
      .where("id", "in", requirement_ids)
      .execute();
  });
};
