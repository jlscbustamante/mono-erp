import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "reflect-metadata";
import { config } from "./config.js";
import assistance from "./router/assistance";

const app = new Hono();

app.use("/api/*", cors());
app.get("/", (c) => {
  return c.text("Api de asistencia");
});

app.route("/api/attendance", assistance);

app.onError((err, c) => {
  c.status(400);
  return c.json({
    message: err.message,
  });
});

serve({
  fetch: app.fetch,
  port: config.port,
});
