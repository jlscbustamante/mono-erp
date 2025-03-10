import { REQUIERMENT_TYPE, REQUIREMENT_STATUS } from "./enums.ts";

export interface IRequirementDetailItem {
  id: number;
  amount: number;
  hasRetention: boolean;
  retention: number;
  netAmount: number;
  cashbankId: number | null;
  cashbankName: string | null;
  paymentMethod: string;
  expiresAt: string | null;
  description: string;
}

export interface IRequirementDetail {
  id: number;
  amount: number;
  companyId: string;
  supplierId: number;
  paymentMethod: string;
  ruc: string;
  legalName: string;
  description: string;
  documentType: string;
  documentNumber: string;
  categoryId: number | null;
  categoryName: string | null;
  costCenterId: number | null;
  costCenterName: string | null;
  numQuotas: number;
  status: REQUIREMENT_STATUS;
  createdBy: string;
  items: IRequirementDetailItem[];
  type: REQUIERMENT_TYPE;
}
