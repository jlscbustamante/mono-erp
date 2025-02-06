export enum PAYMENT_METHOD {
  CREDIT = 'CREDITO',
  CASH = 'CONTADO',
}

export enum REQUIREMENT_STATUS {
  APPROVED = 'A',
  PENDING = 'S',
  PAID = 'P',
  CANCELLED = 'R',
}

export enum REQUIREMENT_TYPE_DOCUMENT {
  FACTURA = '01',
  BOLETA = '03',
  TICKET_SALIDA = '04',
  NOTA_CREDITO = '07',
  NOTA_DEBITO = '08',
  GUIA_REMISION = '09',
  GUIA_TRANSPORTISTA = '31',
}
export interface CreateRequirementDto {
  company: string
  ruc: string
  legal_name: string
  description: string
  document_type: string
  document_number: string
  supplier: number
  cost_center: number
  cost_center_name: string
  amount: number
  cashbank: number
  payment_method: string
  expiration_date: string
  hasRetention: boolean
  retention: number
  quota: number
}
export interface RequirementDetail {
  readonly id: number
  readonly companyId: string
  readonly companyName: string
  readonly costCenterId: number
  readonly costCenterName: string
  readonly supplierId: number
  readonly supplierName: string
  readonly supplierRuc: string
  readonly globalDescription: string
  readonly documentType: string
  readonly documentNumber: string

  readonly amount: number
  readonly expiresAt: string | null
  readonly cashBankId: number | null
  readonly cashBankName: string | null
  readonly status: REQUIREMENT_STATUS

  readonly globalAmount: number
  readonly globalId: number

  readonly createdBy: string
  readonly createdAt: string
}

export interface RequirementPresentation {
  readonly id: number
  readonly supplier: string
  readonly requestedAt: string
  readonly numDoc: string
  readonly description: string
  readonly costCenter: string
  readonly createdBy: string
  readonly approvedBy: string
  readonly paymentMethod: string
  readonly numQuota: number
  readonly expiresAt: string
  readonly amount: number
}

export interface UpdateRequirementDto {
  id: number
  amount: number
  cashBankId?: number
  cashBankName?: string
  expiresAt?: string
  createdBy: string

  globalId: number
  globalCompanyId: string
  globalCostCenterId: number
  globalCostCenterName: string
  globalSupplierId: number
  globalSupplierName: string
  globalSupplierRuc: string
  globalDescription: string
  globalDocumentType: string
  globalDocumentNumber: string
  globalAmount: number
}
