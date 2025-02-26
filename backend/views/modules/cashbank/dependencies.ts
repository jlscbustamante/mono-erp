import { CashbankRepository } from "#app/modules/cashbank/cashbank.repository.ts";
import { CashBankService } from "#app/modules/cashbank/cashbank.service.ts";

export const cashbankService = new CashBankService();
export const cashbankRepository = new CashbankRepository();
