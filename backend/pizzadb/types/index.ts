import type { InferSelectModel } from "drizzle-orm";
import type { companies, requirements } from "../schemas/adm.ts";
import type { cashBanks, costCenters } from "../schemas/fin.ts";

export * from "../filter/index.ts";
export type RequirementSelect = InferSelectModel<typeof requirements>;
export type CompanySelect = InferSelectModel<typeof companies>;
export type CostCenterSelecet = InferSelectModel<typeof costCenters>;
export type CashBankSelect = InferSelectModel<typeof cashBanks>;
