import { db } from "#app/config/database.ts";
import { InvEquivalenceSelect } from "@scope/shared";

export const get_equivalencies = async (): Promise<InvEquivalenceSelect[]> => {
  const equivalencies: InvEquivalenceSelect[] = await db
    .selectFrom("inv_equivalence")
    .selectAll()
    .execute();

  return equivalencies;
};
