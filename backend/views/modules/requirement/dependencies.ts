import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import { RequirementService } from "#app/modules/requirement/requirement.service.ts";

export const requirementRepository = new RequirementRepository();

export const requirementService = new RequirementService(requirementRepository);
