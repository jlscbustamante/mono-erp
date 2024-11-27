export interface IBankReconciliation {
  transactionkey: string

  bnk_name: string

  bnk_date: string

  bnk_operation_text: string

  bnk_operation_num: string

  bnk_amount: number

  bnk_balance: number

  bnk_agency: string

  bnk_user: string

  bnk_utc: string

  bnk_reference: string

  req_id: number | null

  req_description: string

  req_amount: string

  updated_by: string

  created_at: string

  updated_at: string
}
