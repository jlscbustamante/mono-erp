import { ICashAccount } from '@/data/cashAccount/types'
import { ICategory } from '@/data/category/types'
import { ICostCenter } from '@/data/costCenter/types'
import { AccountFlow } from '@/data/types/accountFlow'

import { RequestTypeCategory } from './RequestCategory'
import { RequestType } from './requestType'
import { Retention } from './retention'
import { RequestStatus } from './status'

export interface IRequest {
  id: number
  request_type: RequestType
  description: string
  amount: number
  amount_net: null | number
  amount_ret: null | number
  num_document: string | null
  legal_name: string | null
  legal_number: string | null
  doc_url: string
  retention: Retention
  category_id: number | null
  category_account_id: number | string | null
  account_flow: AccountFlow
  cash_id: number | null
  cash_account_id: number | string | null
  status: RequestStatus
  created_by: string
  approved_by: string
  rejected_by: string | null
  approved_at: string | null
  rejected_at: string | null
  created_at: string
  cost_center_id: number | null
  category_move: RequestTypeCategory
  requested_at: string
  pay_method: string | undefined
}

export interface IFilteredRequest extends IRequest {
  cashAccount: null | ICashAccount
  category: null | ICategory
  cashAccountCategory: null | ICashAccount
  costCenter: null | ICostCenter
}
