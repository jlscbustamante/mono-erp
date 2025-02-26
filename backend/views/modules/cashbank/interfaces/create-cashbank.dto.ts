export interface CreateCashBankDto {
  cashbank: string;
  account_id?: string;
  company_id: string;
  sucursal_id?: string;
  type_cash: number;
  status: number;
}
