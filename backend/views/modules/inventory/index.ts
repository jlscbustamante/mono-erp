import { Hono } from "hono";

export const inventoryRouter = new Hono().get("/items", (c) => {
  const user = c.get("user");
  return c.json({ message: "hi", data: user });
});
