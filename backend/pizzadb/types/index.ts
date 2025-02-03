import type { InferSelectModel } from "drizzle-orm";
import type { requirements } from "../schemas/adm.ts";

export * from "../filter/index.ts";
export type RequirementSelect = InferSelectModel<typeof requirements>;
