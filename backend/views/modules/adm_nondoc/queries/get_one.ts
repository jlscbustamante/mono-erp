import { db } from "#app/config/database.ts";
import { AdmReqNondocsViewDto } from "../../../../shared/types/index.ts";

export const get_one = async (id: number): Promise<AdmReqNondocsViewDto> => {
  const requirement = await db
    .selectFrom("adm_req_nondocs as arn")
    .selectAll()
    .leftJoin("fin_cashbank as fn1", "fn1.id", "arn.cashbank_source_id")
    .leftJoin("fin_cashbank as fn2", "fn2.id", "arn.cashbank_target_id")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  console.log(requirement);

  // return requirement;
  return {} as any;
};
