import { db } from "#app/config/database.ts";
import { generate_payment } from "#app/modules/payment/host_to_host/generate_payment.ts";
import { AdmPaymentOrderUpdate } from "@scope/shared";
import { HTTPException } from "hono/http-exception";

export const authorize_order = async (props: {
  order_id: number;
  otp: string;
  user: string;
  password: string;
}) => {
  // VALIDAR USUARIO Y CONTRASEÑA
  //

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

  const update_payment_order: AdmPaymentOrderUpdate = {
    approved1_by: order.approved1_by,
    approved2_by: order.approved2_by,
  };

  if (!order.approved1_by) {
    update_payment_order["approved1_by"] = props.user;
  } else {
    if (order.approved1_by == props.user) {
      throw new HTTPException(400, {
        message: "El usuario ya aprobó la orden de pago",
      });
    }
    update_payment_order["approved2_by"] = props.user;
  }

  if (update_payment_order["approved2_by"]) {
    // genera pago
    // poner estado ENviado banco
    await generate_payment(props.order_id);
  } else {
    // poner estado APROBADO
  }

  await db
    .updateTable("adm_payment_order")
    .set(update_payment_order)
    .where("id", "=", props.order_id)
    .execute();
};
