import { parseISO, startOfDay, startOfToday } from 'date-fns'

import { RequestRepository } from '../../repositories/request.repository'
import { BalanceStatus } from '../../types/balance'
import { OpFilter } from '../../types/filter'
import {
  RequestAccountFlow,
  RequestCategoryType,
  RequestStatus,
} from '../../types/request'
import { CashAccountService } from '../CashAccount.service'
import { ResourceService } from '../Resource.service'

interface ReportRequest {
  cashAccount: {
    id: number
    name: string
  }
  initialBalance: number
  status: BalanceStatus
  categories: Record<string, number>
  finalBalance: number
}

export const _reportRequest = async (
  instancia: CashAccountService,
  date: string,
  resourceService: ResourceService,
  requestRepository: RequestRepository,
): Promise<ReportRequest[]> => {
  const reportData: ReportRequest[] = (
    await resourceService.getCashAccountsRequest()
  )
    .filter((cash) => startOfDay(parseISO(cash.created_at)) <= parseISO(date))
    .map((cash) => {
      return {
        cashAccount: {
          id: cash.id,
          name: cash.name,
        },
        initialBalance: 0,
        finalBalance: 0,
        status: BalanceStatus.NONE,
        categories: {},
      }
    })
  // obtner saldo inicial de todas
  const peticionesSaldoInicial = []
  const peticionesRequest = []
  const peticionesRequestInCategory = []
  for (const cash of reportData) {
    peticionesSaldoInicial.push(
      instancia.initialBalance(cash.cashAccount.id, date, 'request'),
    )
    peticionesRequest.push(
      requestRepository.filter3({
        relations: {
          cashAccountCategory: true,
          cashAccount: true,
          category: true,
        },
        filters: {
          cash_id: [OpFilter.Equal, cash.cashAccount.id],
          approved_at: [OpFilter.EqualDate, date],
          status: [
            OpFilter.In,
            RequestStatus.Approved,
            RequestStatus.Closed,
            RequestStatus.Registered,
          ],
        },
      }),
    )
    peticionesRequestInCategory.push(
      requestRepository.filter3({
        relations: {
          cashAccountCategory: true,
          cashAccount: true,
          category: true,
        },
        filters: {
          category_id: [OpFilter.Equal, cash.cashAccount.id],
          approved_at: [OpFilter.EqualDate, date],
          category_move: [OpFilter.Equal, RequestCategoryType.Cash],
          status: [
            OpFilter.In,
            RequestStatus.Approved,
            RequestStatus.Closed,
            RequestStatus.Registered,
          ],
        },
      }),
    )
  }
  const [balances, _requests, _requestsInCategory] = await Promise.all([
    Promise.all(peticionesSaldoInicial),
    Promise.all(peticionesRequest),
    Promise.all(peticionesRequestInCategory),
  ])
  const requests = _requests.map((el) => el.data)
  const requestsInCategory = _requestsInCategory.map((el) => el.data)

  // set results
  for (let index = 0, length = reportData.length; index < length; index++) {
    reportData[index].initialBalance = balances[index].balance
    reportData[index].status = balances[index].status
    reportData[index].finalBalance = balances[index].balance
    // calcular saldo cuando esta en caja
    requests[index].forEach((request) => {
      const amount =
        request.retention == '1' ? request.amount_net : request.amount
      const fieldName =
        request.category_move === RequestCategoryType.Cash
          ? request.cashAccountCategory!.name
          : request.category!.name
      reportData[index].categories[fieldName] ??= 0
      if (request.account_flow === RequestAccountFlow.In) {
        reportData[index].finalBalance += amount
        reportData[index].categories[fieldName] += amount
      } else {
        reportData[index].finalBalance -= amount
        reportData[index].categories[fieldName] -= amount
      }
    })
    // calcular saldo cuando esta en categoria
    requestsInCategory[index].forEach((request) => {
      const amount =
        request.retention == '1' ? request.amount_net : request.amount
      reportData[index].categories[request.cashAccount!.name] ??= 0

      if (request.account_flow === RequestAccountFlow.In) {
        reportData[index].finalBalance -= amount
        reportData[index].categories[request.cashAccount!.name] -= amount
      } else {
        reportData[index].finalBalance += amount
        reportData[index].categories[request.cashAccount!.name] += amount
      }
    })
  }

  return reportData
}
