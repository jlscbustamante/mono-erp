import { db } from "#app/database.ts";
import { Hono } from "hono";

export const authRouter = new Hono().get("/me", async (c) => {
  const data = await db.query.users.findMany({
    with: {
      role: true,
    },
  });
  return c.json({ mesage: "na", data: data });
});
