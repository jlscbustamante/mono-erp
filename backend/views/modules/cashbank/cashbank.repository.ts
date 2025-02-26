import { db } from "#app/database.ts";
import { CreateCashBankDto } from "#app/modules/cashbank/interfaces/create-cashbank.dto.ts";
import { cashBanks } from "@scope/pizzadb";
import { transformWhere } from "@scope/pizzadb/filter";
import { CashBankSelect, WhereOption } from "@scope/pizzadb/types";
import { sql } from "drizzle-orm";
export class CashbankRepository {
  async filter(filters: WhereOption<CashBankSelect>[]) {
    const query = transformWhere(filters).join(" AND ");

    const result: CashBankSelect[] = await db.query.cashBanks.findMany({
      where: query ? sql.raw(query) : undefined,
      limit: 500,
    });

    return result;
  }

  async create(data: CreateCashBankDto) {
    await db.insert(cashBanks).values({
      cashbank: data.cashbank,
      company_id: data.company_id,
      type_cash: data.type_cash,
      account_id: data.account_id,
      status: data.status,
      sucursal_id: data.sucursal_id,
    });
  }
}
