import { REQUIERMENT_TYPE } from "./enums.ts";

export interface CreateRequirementDto {
  company: string;
  ruc: string;
  request_type: REQUIERMENT_TYPE;
  legal_name: string;
  description: string;
  document_type: string;
  document_number: string;
  supplier: number;
  cost_center: number;
  cost_center_name: string;
  amount: number;
  cashbank?: number;
  cashbank_name?: string;
  category_id: number;
  category_name: string;
  payment_method: string;
  expiration_date?: string;
  hasRetention: boolean;
  retention: number;
  quota: number;
  detailQuotas: {
    number: number;
    amount: number;
    expiresAt?: string;
  }[];
}
