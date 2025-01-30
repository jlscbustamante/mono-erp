import type { InferSelectModel } from "drizzle-orm";
import type { requirements } from "../index.ts";

export * from "../filter/index.ts";
export type RequirementSelect = InferSelectModel<typeof requirements>;
