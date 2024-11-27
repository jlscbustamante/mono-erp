import { IFilteredRequest } from '@/data/requests/types'

export interface IDetailedReport {
  balance: number
  status: 'C' | 'T' | ''
  requests: IFilteredRequest[]
}
