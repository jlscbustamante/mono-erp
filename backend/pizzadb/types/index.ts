import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { finMoveCash } from "../index.ts";
import type {
  companies,
  requirementItems,
  requirements,
  storeTable,
} from "../schemas/adm.ts";
import type { cashBanks, costCenters } from "../schemas/fin.ts";
import type { suppliers } from "../schemas/inv.ts";

export * from "../filter/index.ts";

export type SupplierSelect = InferSelectModel<typeof suppliers>;
export type RequirementSelect = InferSelectModel<typeof requirements>;
export type RequirementInsert = InferInsertModel<typeof requirements>;

export type RequirementRelationsSelect = RequirementSelect & {
  items: RequirementItemSelect[];
  supplier: SupplierSelect;
};

export type RequirementItemSelect = InferSelectModel<typeof requirementItems>;
export type RequirementItemInsert = InferInsertModel<typeof requirementItems>;

export type CompanySelect = InferSelectModel<typeof companies>;
export type CostCenterSelecet = InferSelectModel<typeof costCenters>;
export type CashBankSelect = InferSelectModel<typeof cashBanks>;
export type MoveCashSelect = InferSelectModel<typeof finMoveCash>;

export type StoreTableSelect = InferSelectModel<typeof storeTable>;
