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
import dayjs from "dayjs";
import { and, eq, inArray } from "drizzle-orm";

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
    await this.requirementRepository.saveAndApprove(data, userName);
  }

  async approve(id: number, userName: string) {
    await this.requirementRepository.approve(id, userName);
  }

  async saveRequirement(data: UpdateRequirementDto) {
    await this.requirementRepository.saveRequirement(data);
  }

  async undoApproval(id: number) {
    await db
      .update(requirementItems)
      .set({
        status: REQUIREMENT_STATUS.PENDING,
      })
      .where(eq(requirementItems.id, id));
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
        } satisfies IRelatedRequirement;
      })
      .filter((el) => el) as IRelatedRequirement[];
  }

  async rejectRequirements(ids: number[]) {
    await db
      .update(requirementItems)
      .set({
        status: REQUIREMENT_STATUS.CANCELLED,
        rejected_at: dayjs().format("YYYY-MM-DD"),
      })
      .where(inArray(requirementItems.id, ids));
  }

  async requirementAmountsMont(
    month: string,
    status: REQUIREMENT_STATUS[],
    fieldDate: "pending" | "approved" | "rejected"
  ) {
    const statusQuery = status.map((el) => `"${el}"`).join(",");
    const fieldName =
      fieldDate == "pending"
        ? "requested_at"
        : fieldDate == "approved"
        ? "approved_at"
        : "rejected_at";
    const [result] =
      await db.execute(`SELECT ari.${fieldName} date,SUM(ari.amount) total FROM adm_request_item ari
WHERE ari.status IN (${statusQuery}) AND MONTH(ari.${fieldName})=${month} GROUP BY DAY(ari.${fieldName})`);

    return (result as any).map((el: any) => {
      return {
        date: el.date.split(" ")[0],
        total: Number(el.total),
      };
    });
  }
}
