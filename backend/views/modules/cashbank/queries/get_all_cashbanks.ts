import { db } from "#app/config/database.ts";
import { FinCashbankSelect } from "@scope/shared";

export const get_all_cashbanks = async (): Promise<FinCashbankSelect[]> => {
  const data = await db.selectFrom("fin_cashbank").selectAll().execute();

  return data;
};
