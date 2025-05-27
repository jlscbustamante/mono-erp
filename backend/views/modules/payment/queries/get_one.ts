import { db } from "#app/config/database.ts";

export const get_one = (id: number) => {
  return db
    .selectFrom("adm_requirement")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};
