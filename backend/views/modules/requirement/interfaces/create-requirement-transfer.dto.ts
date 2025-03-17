export interface CreateRequirementTransferDto {
  company: string;
  description: string;
  document_type: string;
  document_number?: string;
  amount: number;
  cashbank_origin: number;
  cashbank_origin_name: string;
  cashbank_destiny: number;
  cashbank_destiny_name: string;
  expiration_date: string;
  payment_method: string;
}
