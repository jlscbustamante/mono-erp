import { db } from "#app/config/database.ts";
import { xml_pago_proveedores } from "#app/modules/payment/host_to_host/schemas/pago_proveedores.ts";

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

  const xml = xml_pago_proveedores({
    id: 12,
  });
  await bcp_api_send_file(xml);

  return {
    success: true,
  };
};

const bcp_api_send_file = async (content: string) => {
  const url = "http://localhost:2221/send_file";

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });
  const response = await request.json();

  console.log("response ", response);
};
