import { baseUrl } from '@/data/api/baseUrl'
import { Filters } from '@/data/types/Filters'

import { IBankReconciliation } from '../types'

export const filterBankReconciliation = async (
  filters: Filters<IBankReconciliation>,
) => {
  return baseUrl<IBankReconciliation[]>('bank/filter', { query: filters })
}

export const firstPendingReconciliation = async () => {
  return baseUrl<IBankReconciliation[]>('bank/first-pending-reconciliation')
}

export const reconcile = async (
  transactionkey: string,
  data: {
    requirement_id: number
    requirement_description: string
    requirement_amount: number
  },
) => {
  return baseUrl(`bank/reconcile/${transactionkey}`, {
    method: 'PUT',
    body: data,
  })
}
