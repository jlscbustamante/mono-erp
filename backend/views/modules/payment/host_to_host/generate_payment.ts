import { db } from "#app/config/database.ts";

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

  await main_process2();
  console.log("Main.js ejecutado exitosamente con Node");

  return {
    order,
    requirements,
  };
};

const main_process2 = async () => {
  const url = "http://localhost:8080";

  const request = await fetch(url);
  const response = await request.text();

  console.log("response ", response);
};
