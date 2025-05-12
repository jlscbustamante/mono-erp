import { save_log_file } from "#app/modules/log/case/save_log_file.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const log_router = new Hono().post(
  "/motorizer",
  zValidator(
    "json",
    z.object({
      row: z.array(z.string()),
    })
  ),
  async (c) => {
    const user = c.get("user");
    const { row } = c.req.valid("json");

    await save_log_file([...row, user.name], "motorizados.log");

    return c.json({
      message: "ok",
    });
  }
);
