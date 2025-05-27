import { create_contract } from "#app/modules/payment/contract/case/create.ts";
import { AdmReqContractInsert } from "@scope/shared";
import { Hono } from "hono";

export const contract_router = new Hono().post("create", async (c) => {
  const data = (await c.req.json()) as AdmReqContractInsert;
  await create_contract(data);
  return c.json({
    message: "ok",
  });
});
