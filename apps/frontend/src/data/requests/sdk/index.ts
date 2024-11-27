import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { baseUrl } from '@/data/api/baseUrl'
import { ICashAccount, IDetailedReport } from '@/data/cashAccount/types'
import { ISummaryReport } from '@/data/cashAccount/types/summaryReport'
import { ICategory } from '@/data/category/types'
import { ICostCenter } from '@/data/costCenter/types'
import { CashBalanceStatus } from '@/data/types'
import { Filters } from '@/data/types/Filters'

import { ICountFilterResponse } from '../types'
import { IFilteredRequest, IRequest } from '../types/request'

export const requests = async (filters: Filters<IRequest>) => {
  return baseUrl<IFilteredRequest[]>('requests/filter', {
    body: {
      select: {
        cashAccount: { name: true, id: true },
        category: { name: true, id: true },
        cashAccountCategory: { name: true, id: true },
        costCenter: { origin: true, id: true },
      },
      filters,
      relations: {
        category: true,
        cashAccount: true,
        cashAccountCategory: true,
        costCenter: true,
      },
    },
    method: 'POST',
  })
}

export const countRequests = async (filters: Filters<IRequest>) => {
  return baseUrl<ICountFilterResponse>('requests/filter-count', {
    body: { filters },
    method: 'POST',
  })
}

export const createRequest = async (request: Partial<IRequest>) => {
  return baseUrl<{ message: string }>('requests/create', {
    method: 'POST',
    body: request,
  })
}

export const updateRequest = async (request: Partial<IFilteredRequest>) => {
  const req = Object.assign({}, request)
  delete req.request_type
  delete req.cashAccount
  delete req.cashAccountCategory
  delete req.category
  delete req.costCenter

  return baseUrl<{ message: string }>(`requests/update`, {
    method: 'PUT',
    body: req,
  })
}

export const rejectRequest = async (requestId: number) => {
  return baseUrl<{ message: string }>(`requests/reject/${requestId}`, {
    method: 'PUT',
  })
}

export const removeApproval = async (requestId: number) => {
  return baseUrl<{ message: string }>(`requests/remove-approval/${requestId}`, {
    method: 'PUT',
  })
}

export const approveRequest = async (requestId: number) => {
  return baseUrl<{ message: string }>(`requests/approve/${requestId}`, {
    method: 'PUT',
  })
}

export const getNameByRuc = async (ruc: string) => {
  return baseUrl<{ name: string }>(`requests/get-name-by-ruc/${ruc}`)
}

export const categories = () => baseUrl<ICategory[]>('requests/get-categories')

export const cashAccount = () =>
  baseUrl<ICashAccount[]>('requests/get-cash-accounts')

export const costCenters = () =>
  baseUrl<ICostCenter[]>('requests/get-cost-centers')

export const detailedReport = async (cashId: number, date: string) => {
  return baseUrl<IDetailedReport>('requests/detailed-report', {
    query: { cashAccountId: cashId, date: date },
  })
}

export const balanceReportRequest = async (dates: [string, string]) => {
  return baseUrl<{ [key: string]: CashBalanceStatus }>(
    'requests/balance-report',
    {
      query: { dates, module: 'request' },
    },
  )
}

export const closeCashAccounts = async (
  cashAccountIds: number[],
  date: string,
  force?: boolean,
  replace?: boolean,
): Promise<string[] | null> => {
  const body = {
    cashAccountIds,
    date,
    type: 'request',
    force,
    replace,
  }
  const token = localStorage.getItem(ITEM.TOKEN)
  const result = await fetch(`${config.API}/requests/close-cash-accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
  const data = await result.json()
  return data.logs
}

export const summaryReport = async (date: string) => {
  return baseUrl<ISummaryReport[]>('requests/summary-report', {
    query: { date: date },
  })
}

export const reportsByCostCenter = async (start: string, end: string) => {
  return baseUrl<
    { costCenterId: number | null; name: string | null; total: string }[]
  >('requests/report/cost-center', { query: { start, end } })
}
