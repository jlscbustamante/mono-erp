import { db } from "#app/config/database.ts";
import { IAdmSearchAll } from "@scope/shared";
import { sql } from "kysely";

export const search_all = async (text: string): Promise<IAdmSearchAll> => {
  // Create a search pattern for SQL LIKE
  const searchPattern = `%${text}%`;

  // Search in adm_requirement
  const requirements = await db
    .selectFrom("adm_requirement")
    .selectAll()
    .select([sql<string>`'requirement'`.as("type")])
    .where((eb) =>
      eb.or([
        eb("request_code", "like", searchPattern),
        eb("description", "like", searchPattern),
        eb("legal_name", "like", searchPattern),
        eb("num_document", "like", searchPattern),
      ])
    )
    .limit(100)
    .execute();

  // Search in adm_payment_order
  const payment_orders = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .select([sql<string>`'payment_order'`.as("type")])
    // .where("id", "like", searchPattern)
    .where("bankaccount_name", "like", searchPattern)
    .limit(100)
    .execute();

  // Search in adm_req_nondocs
  const req_nondocs = await db
    .selectFrom("adm_req_nondocs")
    .selectAll()
    .select([sql<string>`'req_nondoc'`.as("type")])
    .where((eb) =>
      eb.or([
        // eb("id", "like", searchPattern),
        eb("request_code", "like", searchPattern),
        eb("description", "like", searchPattern),
      ])
    )
    .limit(100)
    .execute();

  return {
    requirements,
    payment_orders,
    req_nondocs,
    total_count:
      requirements.length + payment_orders.length + req_nondocs.length,
  };
};
