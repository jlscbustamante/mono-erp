import { REQUIERMENT_TYPE } from "#app/modules/requirement/interfaces/enums.ts";

export interface UpdateRequirementItemDto {
  id: number;
  amount: number;
  cashbankId?: number;
  cashbankName?: string;
  expiresAt?: string;
  hasRetention: boolean;
  retention: number;
  description: string;
}

export interface UpdateRequirementDto {
  id: number;
  request_type: REQUIERMENT_TYPE;
  companyId: string;
  supplierId: number;
  supplierName: string;
  ruc: string;
  description: string;
  documentType: string;
  paymentMethod: string;
  documentNumber: string;
  categoryId?: number;
  categoryName?: string;
  costCenterId?: number;
  costCenterName?: string;
  amount: number;

  items: UpdateRequirementItemDto[];
}

export interface UpdateTransferRequirementDto {
  request_type: REQUIERMENT_TYPE;
  id: number;
  companyId: string;
  description: string;
  documentType: string;
  documentNumber: string;
  payment_method: string;
  expiration_date: string;
  amount: number;
  origin_id: number;
  cash_origin_id: number;
  cash_origin_name: string;
  destiny_id: number;
  cash_destiny_id: number;
  cash_destiny_name: string;
  approvedAt: string;
}
