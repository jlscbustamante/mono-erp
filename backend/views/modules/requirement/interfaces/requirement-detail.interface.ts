import { REQUIREMENT_STATUS } from "./enums.ts";

export interface IRequirementDetail {
  id: number;
  companyId: string;
  companyName: string;
  costCenterId: number;
  costCenterName: string;
  supplierId: number;
  supplierName: string;
  supplierRuc: string;
  globalDescription: string;
  documentType: string;
  documentNumber: string;

  amount: number;
  expiresAt: string | null;
  cashBankId: number | null;
  cashBankName: string | null;
  status: REQUIREMENT_STATUS;
  description: string;

  globalAmount: number;
  globalId: number;

  createdBy: string;
  createdAt: string;
}
