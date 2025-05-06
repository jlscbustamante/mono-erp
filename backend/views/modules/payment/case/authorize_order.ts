import { db } from "#app/config/database.ts";
import { HTTPException } from "hono/http-exception";

export const authorize_order = async (props: {
  order_id: number;
  otp: string;
  user: string;
  password: string;
}) => {
  const order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", props.order_id)
    .executeTakeFirstOrThrow();

  if (order.approved1_by && order.approved2_by) {
    throw new HTTPException(400, {
      message: "No se puede aprobar la orden de pago",
    });
  }

  const update_payment_order = {
    approved1_by: order.approved1_by,
    approved2_by: order.approved2_by,
  };

  if (!order.approved1_by) {
    update_payment_order["approved1_by"] = props.user;
  } else {
    update_payment_order["approved2_by"] = props.user;
  }

  await db
    .updateTable("adm_payment_order")
    .set(update_payment_order)
    .where("id", "=", props.order_id)
    .execute();
};
