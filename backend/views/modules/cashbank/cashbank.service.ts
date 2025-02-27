import { db } from "#app/database.ts";
import { cashbankRepository } from "#app/modules/cashbank/dependencies.ts";
import { CreateCashBankDto } from "#app/modules/cashbank/interfaces/create-cashbank.dto.ts";
import { cashBanks } from "@scope/pizzadb";
import { CashBankSelect, WhereOption } from "@scope/pizzadb/types";
import { eq } from "drizzle-orm";
export class CashBankService {
  async filter(filters: WhereOption<CashBankSelect>[]) {
    const data = await cashbankRepository.filter(filters);
    return data;
  }

  async create(data: CreateCashBankDto) {
    await cashbankRepository.create(data);
  }

  async update(data: CashBankSelect) {
    await db
      .update(cashBanks)
      .set({
        cashbank: data.cashbank,
        account_id: data.account_id,
        company_id: data.company_id,
        type_cash: data.type_cash,
        status: data.status,
        sucursal_id: data.sucursal_id,
      })
      .where(eq(cashBanks.id, data.id));
  }
}
