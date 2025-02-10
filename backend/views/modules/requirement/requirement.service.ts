import { db } from "#app/database.ts";
import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import {
  CreateRequirementDto,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements } from "@scope/pizzadb";
import type { RequirementItemSelect, WhereOption } from "@scope/pizzadb/types";
import { eq } from "drizzle-orm";

export class RequirementService {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async filter(filters: WhereOption<RequirementItemSelect>[]) {
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

  async saveRequirement(data: UpdateRequirementDto, userName: string) {
    await this.requirementRepository.saveRequirement(data, userName);
  }

  async getRelatedRequirements(requirementId: number) {
    const requirementItem = await db
      .select()
      .from(requirementItems)
      .leftJoin(requirements, eq(requirements.id, requirementItems.request_id))
      .where(eq(requirementItems.id, requirementId));

    return [];
  }
}
