import { zValidator } from "@hono/zod-validator";
import { AdmReqNondocsInsert } from "@scope/shared";
import { Hono } from "hono";
import { z } from "zod";
import { create_nondoc } from "./case/create.ts";

export const admNondocRouter = new Hono().post(
  "requirement",
  zValidator("json", z.any()),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json") as AdmReqNondocsInsert;
    await create_nondoc(data, user.name);
    return c.json({
      message: "ok",
    });
  }
);
