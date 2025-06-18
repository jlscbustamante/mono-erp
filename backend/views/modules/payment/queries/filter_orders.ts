import { db } from "#app/config/database.ts";
import { transformWhere } from "@scope/pizzadb/filter";
import { WhereOption } from "@scope/pizzadb/types";
import { AdmPaymentOrder, AdmPaymentOrderSelect } from "@scope/shared";
import { sql } from "kysely";

export const filter_orders = async (
  filters: WhereOption<AdmPaymentOrder>[]
): Promise<AdmPaymentOrderSelect[]> => {
  const query = transformWhere(filters).join(" AND ");

  let result;
  if (filters.length > 0) {
    const data = await sql`SELECT * FROM adm_payment_order WHERE ${sql.raw(
      query
    )} ORDER BY required_at DESC`.execute(db);
    result = data.rows as AdmPaymentOrderSelect[];
  } else {
    const data =
      await sql`SELECT * FROM adm_payment_order ORDER BY required_at DESC`.execute(
        db
      );
    result = data.rows as AdmPaymentOrderSelect[];
  }

  return result;
};
