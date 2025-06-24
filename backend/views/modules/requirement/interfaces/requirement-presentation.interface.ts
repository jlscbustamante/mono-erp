import { REQUIREMENT_TYPE } from "./enums.ts";

export interface IRequirementPresentation {
  id: number;
  supplier: string;
  requestedAt: string;
  numDoc: string;
  description: string;
  costCenter: string;
  category: string;
  paymentMethod: string;
  numQuota: number;
  amount: number;
  createdBy: string;
  type: REQUIREMENT_TYPE;
  originName?: string;
  destinyName?: string;
  status: string;
}
