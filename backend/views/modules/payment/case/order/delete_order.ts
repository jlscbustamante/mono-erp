import { db } from "#app/config/database.ts";
import { ORDER_PAYMENT_STATUS, PAYMENT_STATUS } from "@scope/shared";

export const delete_order = async (
  order_id: number,
  delete_related: boolean
) => {
  await db.transaction().execute(async (tx) => {
    await tx
      .updateTable("adm_payment_order")
      .set({
        status: ORDER_PAYMENT_STATUS.CANCELED,
      })
      .where("id", "=", order_id)
      .execute();

    if (delete_related) {
      await tx
        .updateTable("adm_requirement")
        .set({
          status: PAYMENT_STATUS.CANCELED,
        })
        .where("payment_order_id", "=", order_id)
        .execute();
    } else {
      await tx
        .updateTable("adm_requirement")
        .set({
          status: PAYMENT_STATUS.REGISTERED,
          payment_order_id: null,
        })
        .where("payment_order_id", "=", order_id)
        .execute();
    }
  });
};
