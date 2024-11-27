import { CashBalanceStatus } from '@/data/types'

export interface ISummaryReport {
  cashAccount: {
    id: number
    name: string
  }
  initialBalance: number
  finalBalance: number
  status: CashBalanceStatus
  categories: { [key: string]: number }
}
