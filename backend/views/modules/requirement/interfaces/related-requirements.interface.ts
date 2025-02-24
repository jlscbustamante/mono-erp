import { REQUIREMENT_STATUS } from "./enums.ts";
export interface IRelatedRequirement {
  id: number;
  quota: number;
  value: number;
  description: string;
  status: REQUIREMENT_STATUS;
}
