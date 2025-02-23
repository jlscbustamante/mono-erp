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
