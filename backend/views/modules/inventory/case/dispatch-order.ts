import { db } from "#app/config/database.ts";
export class DispatchOrder {
  async execute(id: number) {
    const users = await db.selectFrom("iam_user").selectAll().execute();
    return users;
  }
}
