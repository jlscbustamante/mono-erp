import { db } from "#app/config/database.ts";
import { redis } from "#app/config/redis.ts";
import { xml_pago_proveedores } from "#app/modules/payment/host_to_host/schemas/pago_proveedores.ts";
import { format } from "date-fns";
import { HTTPException } from "hono/http-exception";

export const generate_payment = async (order_id: number) => {
  const order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", order_id)
    .executeTakeFirstOrThrow();
  const requirements = await db
    .selectFrom("adm_requirement")
    .selectAll()
    .where("payment_order_id", "=", order_id)
    .execute();
  if (!order.payment_at)
    throw new HTTPException(400, {
      message: "El campo payment_at no puede estar vacio",
    });

  const date = new Date(order.payment_at);

  const payment_file_identifier = await get_payment_file_identifier(date);

  const company = {
    legal_name: "PIZZA RAUL SAC",
    ruc: "20512345678",
  };

  const xml = xml_pago_proveedores(payment_file_identifier, {
    id: 12,
    file_date: format(new Date(), "yyyy-MM-ddTHH:mm:ss"),
    quantity_transactions: requirements.length,
    company_legal_name: company.legal_name,
  });
  // await bcp_api_send_file(xml, payment_file_identifier);

  // await db
  //   .updateTable("adm_payment_order")
  //   .set({
  //     status: ORDER_PAYMENT_STATUS.SENT_TO_BANK,
  //   })
  //   .where("id", "=", order_id)
  //   .execute();

  return {
    success: true,
  };
};

const get_payment_file_identifier = async (date: Date): Promise<string> => {
  const formated_date = format(date, "yyyyMMdd");
  const secuence_number = await get_secuence_number();
  return `P${formated_date}${secuence_number}P`;
};

const get_secuence_number = async (): Promise<string> => {
  const redis_secuence_number = await redis.get("erp:hth:secuence_number");
  let placeholder = "000000";
  let secuence_number = 0;
  if (redis_secuence_number) {
    secuence_number = parseInt(redis_secuence_number) + 1;
  }
  placeholder =
    placeholder.substring(0, 6 - secuence_number.toString().length) +
    secuence_number.toString();
  await redis.set("erp:hth:secuence_number", secuence_number.toString());
  return placeholder;
};

const bcp_api_send_file = async (content: string, file_identifier: string) => {
  const url = "http://localhost:2221/send_file";

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      file_identifier,
    }),
  });
  const response = await request.json();
  if (!request.ok) {
    throw new Error(response.message ?? "Error pos service");
  }
};
