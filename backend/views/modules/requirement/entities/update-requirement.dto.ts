export interface UpdateRequirementDto {
  id: number;
  amount: number;
  cashBankId?: number;
  cashBankName?: string;
  expiresAt?: string;
  createdBy: string;

  globalId: number;
  globalCompanyId: string;
  globalCostCenterId: number;
  globalCostCenterName: string;
  globalSupplierId: number;
  globalSupplierName: string;
  globalSupplierRuc: string;
  globalDescription: string;
  globalDocumentType: string;
  globalDocumentNumber: string;
  globalAmount: number;
}
