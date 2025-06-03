import { db } from "#app/config/database.ts";
import { check_authorized_user } from "#app/modules/payment/case/security/check_user.ts";
import { generate_payment } from "#app/modules/payment/host_to_host/generate_payment.ts";
import {
  AdmPaymentOrderUpdate,
  ORDER_PAYMENT_STATUS,
  PAYMENT_STATUS,
} from "@scope/shared";
import { HTTPException } from "hono/http-exception";
import { get_authorized_user } from "../queries/get_authorized_users.ts";

export const authorize_order = async (props: {
  order_id: number;
  otp: string;
  user: string;
  password: string;
}) => {
  const authorized_users = get_authorized_user();
  const user_found = authorized_users.find(
    (el) => el.name.toLowerCase() === props.user.toLowerCase()
  );
  if (!user_found) {
    throw new HTTPException(400, {
      message: "Usuario no autorizado para aprobar orden de pago",
    });
  }

  const is_valid = await check_authorized_user(props.user, props.password);
  if (!is_valid) {
    throw new HTTPException(400, {
      message: "Usuario o contraseña incorrectos",
    });
  }

  const order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", props.order_id)
    .executeTakeFirstOrThrow();

  const order_authorizations: string[] = [];
  if (order.approved1_by) {
    order_authorizations.push(order.approved1_by);
  }
  if (order.approved2_by) {
    order_authorizations.push(order.approved2_by);
  }

  const need_authorization =
    authorized_users.slice(0, 2).length != order_authorizations.length;
  if (!need_authorization) {
    throw new HTTPException(400, {
      message: "Orden de pago ya aprobada",
    });
  }

  if (order_authorizations.includes(props.user)) {
    throw new HTTPException(400, {
      message: "El usuario ya aprobó la orden de pago",
    });
  }

  order_authorizations.push(props.user);

  const update_payment_order: AdmPaymentOrderUpdate = {
    approved1_by: order_authorizations[0],
    approved2_by: order_authorizations[1],
  };

  if (order_authorizations.length == authorized_users.slice(0, 2).length) {
    update_payment_order.status = ORDER_PAYMENT_STATUS.SENT_TO_BANK;
    await generate_payment(props.order_id);
  } else {
    update_payment_order.status = ORDER_PAYMENT_STATUS.APPROVED;
  }

  await db
    .updateTable("adm_payment_order")
    .set(update_payment_order)
    .where("id", "=", props.order_id)
    .execute();

  await db
    .updateTable("adm_requirement")
    .set({
      status: PAYMENT_STATUS.APPROVED,
    })
    .where("payment_order_id", "=", props.order_id)
    .execute();
};
