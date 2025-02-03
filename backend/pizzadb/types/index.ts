import type { InferSelectModel } from "drizzle-orm";
import type { companies, requirements } from "../schemas/adm.ts";

export * from "../filter/index.ts";
export type RequirementSelect = InferSelectModel<typeof requirements>;
export type CompanySelect = InferSelectModel<typeof companies>;
