import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import { RequirementResourceService } from "#app/modules/requirement/requirement-resources.service.ts";
import { RequirementService } from "#app/modules/requirement/requirement.service.ts";

export const requirementRepository = new RequirementRepository();

export const requirementService = new RequirementService(requirementRepository);
export const requirementResourceService = new RequirementResourceService();
