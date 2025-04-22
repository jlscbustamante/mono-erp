import { db } from "#app/config/database.ts";
import { AdmReqNondocsViewDto } from "../../../../shared/types/index.ts";

export const get_one = async (id: number): Promise<AdmReqNondocsViewDto> => {
  const requirement = await db
    .selectFrom("adm_req_nondocs as arn")
    .selectAll()
    .leftJoin("fin_cashbank as fn1", "fn1.id", "arn.cashbank_source_id")
    .leftJoin("fin_cashbank as fn2", "fn2.id", "arn.cashbank_target_id")
    .selectAll("arn")
    .select([
      "fn1.cashbank as cashbank_source_name",
      "fn2.cashbank as cashbank_target_name",
    ])
    .where("arn.id", "=", id)
    .executeTakeFirstOrThrow();

  return requirement satisfies AdmReqNondocsViewDto;
};
