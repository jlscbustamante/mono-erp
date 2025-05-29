import { Hono } from "hono";

export const authRouter = new Hono().get("/me", (c) => {
  const user = c.get("user");
  return c.json({
    data: user,
  });

  // return c.json({ mesage: "na", data: data });
});
