import { db } from "#app/database.ts";
import { IRelatedRequirement } from "#app/modules/requirement/interfaces/related-requirements.interface.ts";
import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import {
  CreateRequirementDto,
  REQUIREMENT_STATUS,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements } from "@scope/pizzadb";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";
import { and, eq, inArray } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { transformWhere } from "../../../pizzadb/filter/transform.ts";

export class RequirementService {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async filter(filters: WhereOption<RequirementSelect>[]) {
    const data = await this.requirementRepository.filter(filters);
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
    console.log("query : ", query);
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
}
