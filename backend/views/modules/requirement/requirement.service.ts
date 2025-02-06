import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import {
  CreateRequirementDto,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import type { RequirementItemSelect, WhereOption } from "@scope/pizzadb/types";

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

  async rejectRequirement(id: number) {}
}
