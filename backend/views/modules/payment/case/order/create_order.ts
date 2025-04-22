import { db } from "#app/config/database.ts";
import {
  CreateOrderDto,
  ORDER_PAYMENT_STATUS,
  PAYMENT_STATUS,
} from "@scope/shared";

export const create_order = async (data: CreateOrderDto, username: string) => {
  const { requirement_ids, ...payment_order } = data;
  await db.transaction().execute(async (trx) => {
    const result = await trx
      .insertInto("adm_payment_order")
      .values({
        ...payment_order,
        status: ORDER_PAYMENT_STATUS.REGISTERED,
        required_at: new Date(),
        required_by: username,
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
        payment_order_id: data.id,
      })
      .where("id", "in", requirement_ids)
      .execute();
  });
};
