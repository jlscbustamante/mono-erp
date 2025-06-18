import { db } from "#app/config/database.ts";
import { create_contract } from "#app/modules/payment/contract/case/create.ts";
import { zValidator } from "@hono/zod-validator";
import { AdmReqContractInsert } from "@scope/shared";
import { Hono } from "hono";
import { z } from "zod";

export const contract_router = new Hono()
  .post("create", async (c) => {
    const data = (await c.req.json()) as AdmReqContractInsert;
    await create_contract(data);
    return c.json({
      message: "ok",
    });
  })
  .get("list/:contract_id", async (c) => {
    const contract_id = c.req.param("contract_id");
    const contract = await db
      .selectFrom("adm_req_contract")
      .selectAll()
      .where("id", "=", +contract_id)
      .executeTakeFirst();

    return c.json({
      message: "ok",
      data: contract,
    });
  })
  .get(
    "exists",
    zValidator(
      "query",
      z.object({
        // contract_id: z.string().transform((val) => +val),
        contract_code: z.string(),
      })
    ),
    async (c) => {
      const { contract_code } = c.req.valid("query");
      const exists = await db
        .selectFrom("adm_req_contract")
        .select("id")
        .where("contract_code", "=", contract_code)
        .executeTakeFirst();

      return c.json({
        message: "ok",
        data: {
          exists: !!exists,
          contract_id: exists?.id ?? null,
        },
      });
    }
  );
