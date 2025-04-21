import type { Insertable, Selectable } from "kysely";
import type { AdmRequirement } from "./generated.ts";

export type AdmRequirementInsert = Insertable<AdmRequirement>;
export type AdmRequirementSelect = Selectable<AdmRequirement>;
