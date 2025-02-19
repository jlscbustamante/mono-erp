export interface CreateRequirementDto {
  company: string;
  ruc: string;
  legal_name: string;
  description: string;
  document_type: string;
  document_number: string;
  supplier: number;
  cost_center: number;
  cost_center_name: string;
  amount: number;
  cashbank: number;
  category_id: number;
  category_name: string;
  payment_method: string;
  expiration_date: string;
  hasRetention: boolean;
  retention: number;
  quota: number;
  detailQuotas: {
    number: number;
    amount: number;
  }[];
}
