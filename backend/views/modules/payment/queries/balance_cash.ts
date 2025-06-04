import { db } from "#app/config/database.ts";
import { PAYMENT_STATUS } from "@scope/shared";
import { format } from "date-fns";
import { sql } from "kysely";

export const initial_balance_cash = async (cash_id: number, date: string) => {
  const last_balance = await db
    .selectFrom("fin_cashbank_balance")
    .selectAll()
    .where("cashbank_id", "=", cash_id)
    .where(sql`DATE(balance_at)`, "<=", date)
    .orderBy("balance_at", "desc")
    .executeTakeFirst();

  let balance = 0;
  if (last_balance && last_balance.balance_at) {
    const balance_at = format(new Date(last_balance.balance_at), "yyyy-MM-dd");
    const calculate_balance = await calculate_balance_since({
      cash_id: cash_id,
      start_date: balance_at,
      end_date: date,
      initial_balance: last_balance.balance ? +last_balance.balance : 0,
    });
    balance = calculate_balance;
  } else {
    const calculated_balance = await calculate_balance({
      cash_id: cash_id,
      date: date,
    });
    balance = calculated_balance;
  }

  return balance;
};

const calculate_balance = async ({
  cash_id,
  date,
}: {
  cash_id: number;
  date: string;
}): Promise<number> => {
  const payments = await db
    .selectFrom("adm_requirement")
    .select(["id", "amount"])
    .where("cashbank_id", "=", cash_id)
    .where("status", "in", [
      PAYMENT_STATUS.SENT_TO_BANK,
      PAYMENT_STATUS.APPROVED,
      PAYMENT_STATUS.PAID,
    ])
    .where(sql`DATE(requested_at)`, "<", date)
    .execute();
  const total_amount = payments.reduce(
    (acc, el) => acc + (el.amount ? +el.amount : 0),
    0
  );

  // NON DOCS
  const non_docs = await db
    .selectFrom("adm_req_nondocs")
    .selectAll()
    .where((eb) =>
      eb.or([
        eb("cashbank_source_id", "=", cash_id),
        eb("cashbank_target_id", "=", cash_id),
      ])
    )
    .where("status", "in", [PAYMENT_STATUS.REGISTERED])
    .where(sql`DATE(requested_at)`, "<", date)
    .execute();
  const total_amount_non_docs = non_docs.reduce(
    (acc, el) => acc + (el.amount ? +el.amount : 0),
    0
  );
  const total = total_amount + total_amount_non_docs;

  return 0 - total;
};

const calculate_balance_since = async ({
  cash_id,
  start_date,
  end_date,
  initial_balance,
}: {
  cash_id: number;
  start_date: string;
  end_date: string;
  initial_balance: number;
}): Promise<number> => {
  const payments = await db
    .selectFrom("adm_requirement")
    .select(["id", "amount"])
    .where("cashbank_id", "=", cash_id)
    .where("status", "in", [
      PAYMENT_STATUS.SENT_TO_BANK,
      PAYMENT_STATUS.APPROVED,
      PAYMENT_STATUS.PAID,
    ])
    .where(sql`DATE(requested_at)`, "<", end_date)
    .where(sql`DATE(requested_at)`, ">=", start_date)
    .execute();
  const total_amount = payments.reduce(
    (acc, el) => acc + (el.amount ? +el.amount : 0),
    0
  );

  // NON DOCS
  const non_docs = await db
    .selectFrom("adm_req_nondocs")
    .selectAll()
    .where((eb) =>
      eb.or([
        eb("cashbank_source_id", "=", cash_id),
        eb("cashbank_target_id", "=", cash_id),
      ])
    )
    .where("status", "in", [PAYMENT_STATUS.REGISTERED])
    .where(sql`DATE(requested_at)`, "<", end_date)
    .where(sql`DATE(requested_at)`, ">=", start_date)
    .execute();
  const total_amount_non_docs = non_docs.reduce(
    (acc, el) => acc + (el.amount ? +el.amount : 0),
    0
  );
  const total = total_amount + total_amount_non_docs;

  return initial_balance - total;
};
