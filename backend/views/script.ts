import { db } from "#app/config/database.ts";
import { jsonObjectFrom } from "kysely/helpers/mysql";
import { InvSupplier } from "../shared/db/generated.ts";
import { loadGlobalEnv } from "../shared/load-env.ts";

await loadGlobalEnv();

const supplier = await db
  .selectFrom("inv_supplier")
  .selectAll()
  .where("id", "=", 25)
  .execute();

const requirements = await db
  .selectFrom("adm_requirement as adm")
  .selectAll()
  .select((eb) => [
    "id",
    jsonObjectFrom(
      eb
        .selectFrom("inv_supplier as inv")
        .select([
          "inv.id",
          "inv.address",
          "inv.bank_account_cci",
          "inv.bank_account_mny",
          "inv.bank_account_num",
          "inv.bank_account_type",
          "inv.bank_code",
          "inv.bank_name",
          "inv.created_at",
          "inv.legal_name",
          "inv.legal_number",
          "inv.status",
          "inv.supplier",
          "inv.type_supplier",
          "inv.updated_at",
        ])
        .whereRef("inv.id", "=", "adm.supplier_id")
    ).as("supplier"),
  ])
  .where("adm.id", "=", 123)
  .execute();

function selectAllWithPrefix<T>(tableAlias: string): (keyof T)[] {
  return Object.keys({} as T).map((k) => `${tableAlias}.${k}` as keyof T);
}

const supplierFields = selectAllWithPrefix<InvSupplier>("inv");

const requirements2 = await db
  .selectFrom("adm_requirement as adm")
  .selectAll()
  .select((eb) => [
    "id",
    jsonObjectFrom(
      eb
        .selectFrom("inv_supplier as inv")
        .select(supplierFields)
        .whereRef("inv.id", "=", "adm.supplier_id")
    ).as("supplier"),
  ])
  .where("adm.id", "=", 123)
  .execute();

console.log("req: ", requirements2);
