import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import type { RequirementSelect, WhereOption } from "@scope/pizzadb/types";

export class RequirementService {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async filter(filters: WhereOption<RequirementSelect>[]) {
    const data = await this.requirementRepository.filter(filters);
    return data;
  }

  async createResources() {
    //
  }
}
