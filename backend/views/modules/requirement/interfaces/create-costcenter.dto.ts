export interface CreateCostCenterDto {
  costcenter: string;
  company_id?: string;
  sucursal_id: string;
  type_cc: string;
  account_link1?: string;
  account_link2?: string;
  account_link3?: string;
  status: 1 | 0;
}
