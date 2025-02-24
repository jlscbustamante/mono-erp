import { REQUIREMENT_STATUS } from "#app/modules/types/index.ts";

export interface IRelatedRequirement {
  id: number;
  quota: number;
  value: number;
  description: string;
  status: REQUIREMENT_STATUS;
}
