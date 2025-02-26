import { cashbankRepository } from "#app/modules/cashbank/dependencies.ts";
import { CreateCashBankDto } from "#app/modules/cashbank/interfaces/create-cashbank.dto.ts";
import { CashBankSelect, WhereOption } from "@scope/pizzadb/types";
export class CashBankService {
  async filter(filters: WhereOption<CashBankSelect>[]) {
    const data = await cashbankRepository.filter(filters);
    return data;
  }

  async create(data: CreateCashBankDto) {
    await cashbankRepository.create(data);
  }
}
