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
  const payment_file_name = `${payment_file_identifier}.xml`;

  const company = {
    legal_name: "PIZZA RAUL SAC",
    ruc: "20512345678",
    checking_account: "1234567890",
    account_type: "CACC", // CACC corriente, MAST maestra
    currency: "USD", // USD, PEN
    reference: "gersonberrocal@gmail.com",
  };

  const supplier = {
    legal_name: "Vilela Medina Susana",
    type_and_num_doc: "D/73108198", // D: DNI, C: CE, R:RUC,P:PAS, X:FIC
    account: "1234567890",
    account_type: "CACC", // CACC corriente, MAST: Maestra, SVGS: Ahorro, ITBK: interbancario
    currency: "USD", // USD, PEN
  };

  const total = requirements.reduce((acc, requirement) => {
    const amount = requirement.amount ? +requirement.amount : 0;
    return acc + amount;
  }, 0);

  const COMPANY_CONTRACT_NUMBER = "1234567890";
  const TYPE_DOCUMENT = "CINV"; // factura del proveedor
  const DOCUMENT_TYPE = "F001-4143";

  const xml = xml_pago_proveedores(payment_file_identifier, {
    generated_file_date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    // quantity_transactions: requirements.length,
    quantity_transactions: 2,
    company_legal_name: company.legal_name,
    file_name: payment_file_name,
    total_amount: total,
    company_contract_number: COMPANY_CONTRACT_NUMBER,
    payment_date: format(date, "yyyy-MM-dd"),
    payments: [
      {
        debtor_legal_name: company.legal_name,
        debtor_ruc: company.ruc,
        debtor_account: company.checking_account,
        debtor_type_account: company.account_type,
        debtor_currency: company.currency,
        debtor_reference: company.reference,
        amount: 13,
        creditor_name: supplier.legal_name,
        creditor_document_identifier: supplier.type_and_num_doc,
        creditor_account: supplier.account,
        creditor_type_account: supplier.account_type,
        creditor_currency: supplier.currency,
        payment_document_type: TYPE_DOCUMENT,
        payment_document_number: DOCUMENT_TYPE,
        payment_document_amount: 13,
      },
      {
        debtor_legal_name: company.legal_name,
        debtor_ruc: company.ruc,
        debtor_account: company.checking_account,
        debtor_type_account: company.account_type,
        debtor_currency: company.currency,
        debtor_reference: company.reference,
        amount: 14,
        creditor_name: supplier.legal_name,
        creditor_document_identifier: supplier.type_and_num_doc,
        creditor_account: supplier.account,
        creditor_type_account: supplier.account_type,
        creditor_currency: supplier.currency,
        payment_document_type: TYPE_DOCUMENT,
        payment_document_number: DOCUMENT_TYPE,
        payment_document_amount: 14,
      },
    ],
  });
  await bcp_api_send_file(xml, payment_file_identifier);

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
