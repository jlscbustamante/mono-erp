export interface IRequirementPresentation {
  id: number;
  supplier: string;
  requestedAt: string;
  numDoc: string;
  description: string;
  costCenter: string;
  category: string;
  createdBy: string;
  approvedBy: string;
  rejectedBy: string;
  paymentMethod: string;
  numQuota: number;
  expiresAt: string;
  amount: number;
}
