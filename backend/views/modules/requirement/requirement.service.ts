import { db } from "#app/database.ts";
import { IRelatedRequirement } from "#app/modules/requirement/interfaces/related-requirements.interface.ts";
import { UpdateTransferRequirementDto } from "#app/modules/requirement/interfaces/update-requirement.dto.ts";
import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import {
  CreateRequirementDto,
  CreateRequirementTransferDto,
  REQUIERMENT_TYPE,
  REQUIREMENT_STATUS,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements } from "@scope/pizzadb";
import type {
  RequirementInsert,
  RequirementItemInsert,
  RequirementRelationsSelect,
  RequirementSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import { format } from "date-fns";
import { and, eq, inArray, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { transformWhere } from "../../../pizzadb/filter/transform.ts";

export class RequirementService {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async filter(filters: WhereOption<RequirementSelect>[]) {
    const data = await this.requirementRepository.filter(filters);
    return data;
  }

  async filterCount(filters: WhereOption<RequirementSelect>[], month?: number) {
    const data = await this.requirementRepository.filterCountByType(
      filters,
      month
    );
    return data;
  }

  async createRequirement(data: CreateRequirementDto, name: string) {
    await this.requirementRepository.createRequirement(data, name);
  }

  async getRequirement(id: number) {
    return await this.requirementRepository.getRequirement(id);
  }

  async saveAndApprove(data: UpdateRequirementDto, userName: string) {
    await this.requirementRepository.saveAndApprove(data);
  }

  async approve(id: number, userName: string) {
    await this.requirementRepository.approve(id, userName);
  }

  async saveRequirement(data: UpdateRequirementDto) {
    await this.requirementRepository.saveRequirement(data);
  }

  async saveTransferRequirement(data: UpdateTransferRequirementDto) {
    await this.requirementRepository.saveTransferRequirement(data);
  }

  async undoApproval(id: number) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          status: REQUIREMENT_STATUS.PENDING,
        })
        .where(eq(requirements.id, id));
      await manager
        .update(requirementItems)
        .set({
          status: REQUIREMENT_STATUS.PENDING,
        })
        .where(eq(requirementItems.request_id, id));
    });
  }

  async getRelatedRequirements(
    requirementId: number
  ): Promise<IRelatedRequirement[]> {
    const requirementItem = await db
      .select()
      .from(requirements)
      .leftJoin(
        requirementItems,
        eq(requirements.id, requirementItems.request_id)
      )
      .where(
        and(
          eq(requirements.id, requirementId),
          eq(requirementItems.status, REQUIREMENT_STATUS.PENDING)
        )
      );

    return requirementItem
      .map((el) => {
        if (!el.adm_request_item || !el.adm_request) return null;
        return {
          id: el.adm_request_item.id,
          quota: el.adm_request.nro_quotas ?? 1,
          value: el.adm_request_item.amount ?? 0,
          description: el.adm_request_item.description ?? "",
          status: el.adm_request_item.status as REQUIREMENT_STATUS,
        } satisfies IRelatedRequirement;
      })
      .filter((el) => el) as IRelatedRequirement[];
  }

  async rejectRequirements(ids: number[]) {
    const first = await db.query.requirementItems.findFirst({
      where: eq(requirementItems.id, ids[0]),
    });
    if (!first) {
      throw new HTTPException(400, {
        message: "No se encontraron requerimientos",
      });
    }
    const requirement = await db.query.requirements.findFirst({
      where: eq(requirements.id, first.request_id),
      with: {
        items: true,
      },
    });
    if (!requirement) {
      throw new HTTPException(400, {
        message: "No se encontraron requerimientos",
      });
    }
    await db.transaction(async (manager) => {
      await manager
        .update(requirementItems)
        .set({
          status: REQUIREMENT_STATUS.CANCELLED,
        })
        .where(inArray(requirementItems.id, ids));

      if (
        requirement.items.filter(
          (el) => el.status == REQUIREMENT_STATUS.PENDING
        ).length === ids.length
      ) {
        await manager
          .update(requirements)
          .set({
            status: REQUIREMENT_STATUS.CANCELLED,
          })
          .where(eq(requirements.id, first.request_id));
      }
    });
  }

  async requirementAmountsMont(
    month: string,
    status: REQUIREMENT_STATUS[],
    filters?: WhereOption<RequirementSelect>[]
  ) {
    const statusQuery = status.map((el) => `"${el}"`).join(",");
    const fieldName = "requested_at";
    const query = filters
      ? transformWhere<RequirementSelect>(filters, "ari").join(" AND ")
      : "";
    const [result] =
      await db.execute(`SELECT ari.${fieldName} date,SUM(ari.amount) total FROM adm_request ari
WHERE ari.status IN (${statusQuery}) AND MONTH(ari.${fieldName})=${month} ${
        query ? `AND ${query}` : ""
      } GROUP BY DAY(ari.${fieldName})`);

    return (result as any).map((el: any) => {
      return {
        date: el.date.split(" ")[0],
        total: Number(el.total),
      };
    });
  }

  async createTransfer(data: CreateRequirementTransferDto, name: string) {
    //
    const newRequiremnt: RequirementInsert = {
      created_by: name,
      requested_at: format(new Date(), "yyyy-MM-dd"),
      description: data.description,
      amount: data.amount,
      status: REQUIREMENT_STATUS.PENDING,
      type_document: data.document_type,
      num_document: data.document_number,
      request_type: REQUIERMENT_TYPE.TRANSFER,
    };

    const newRequirementItemOrigin: RequirementItemInsert = {
      request_id: 0,
      expires_at: data.expiration_date,
      amount: data.amount,
      cashbank_id: data.cashbank_origin,
      cashbank_name: data.cashbank_origin_name,
    };

    const newRequirementItemDestiny: RequirementItemInsert = {
      request_id: 0,
      expires_at: data.expiration_date,
      amount: data.amount,
      cashbank_id: data.cashbank_destiny,
      cashbank_name: data.cashbank_destiny_name,
    };

    await db.transaction(async (manager) => {
      const [result] = await manager.insert(requirements).values(newRequiremnt);
      const resultId = result.insertId;
      await manager.insert(requirementItems).values([
        {
          ...newRequirementItemOrigin,
          request_id: resultId,
        },
        {
          ...newRequirementItemDestiny,
          request_id: resultId,
        },
      ]);
    });
  }

  async getDetailedReport(
    date: string,
    cashAccountId: number
  ): Promise<RequirementRelationsSelect[]> {
    const listIds = await db.query.requirements.findMany({
      columns: {
        id: true,
      },
      where: sql`DATE(${requirements.requested_at})=${date}`,
      with: {
        items: {
          where: and(eq(requirementItems.cashbank_id, cashAccountId)),
        },
      },
    });
    const listRequirements = await db.query.requirements.findMany({
      where: inArray(
        requirements.id,
        listIds.map((el) => el.id)
      ),
      with: {
        items: true,
      },
    });
    return listRequirements;
  }
  async getInitialBalance(cashId: number, date: string) {
    //
    return 124141;
  }
}
