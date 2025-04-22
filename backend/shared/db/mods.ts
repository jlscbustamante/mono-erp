import type { Insertable, Selectable } from "kysely";
import type { AdmPaymentOrder, AdmRequirement } from "./generated.ts";

export type AdmRequirementInsert = Insertable<AdmRequirement>;
export type AdmRequirementSelect = Selectable<AdmRequirement>;

export type AdmPaymentOrderInsert = Insertable<AdmPaymentOrder>;
export type AdmPaymentOrderSelect = Selectable<AdmPaymentOrder>;
