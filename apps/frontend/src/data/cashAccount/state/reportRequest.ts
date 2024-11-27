import dayjs from 'dayjs'
import { atom, RecoilState, selector } from 'recoil'

import { IFilteredRequest, Retention } from '@/data/requests/types'
import { AccountFlow } from '@/data/types/accountFlow'

import { IDetailedReport } from '../types'
type repreq = {
  date: string
  cashId: number | null
}
export const reportRequestFiltersSt: RecoilState<repreq> = atom({
  key: 'reportRequestFiltersSt',
  default: {
    date: dayjs().format('YYYY-MM-DD'),
    cashId: null,
  } as repreq,
})

export const detailedReportSt: RecoilState<IDetailedReport | null> = atom({
  key: 'reportRequestDataSt',
  default: null as IDetailedReport | null,
})

export const detailedMovesSt = selector({
  key: 'detailedMovesSt',
  get: ({ get }) => {
    const data = get(detailedReportSt)
    const { cashId } = get(reportRequestFiltersSt)
    const inputs: IFilteredRequest[] = []
    const outputs: IFilteredRequest[] = []
    data?.requests.forEach((request) => {
      if (request.account_flow == AccountFlow.Input) {
        if (cashId == request.cash_id) inputs.push(request)
        else outputs.push(request)
      } else {
        if (cashId == request.cash_id) outputs.push(request)
        else inputs.push(request)
      }
    })
    return {
      initialBalance: data?.balance ? Number(data.balance.toFixed(2)) : 0,
      inputs,
      outputs,
    }
  },
})

export const availableFiltersUserSt = selector({
  key: 'availableCreatedAtSt',
  get: ({ get }) => {
    const data = get(detailedReportSt)
    const users: { created_by: string[]; approved_by: string[] } = {
      created_by: [],
      approved_by: [],
    }
    data?.requests.forEach((request) => {
      users.created_by.push(request.created_by)
      users.approved_by.push(request.approved_by)
    })

    // delete duplicated values in created_by and approved_by
    users.created_by = [...new Set(users.created_by)]
    users.approved_by = [...new Set(users.approved_by)]

    return users
  },
})

export const endingBalanceDetailedSt = selector({
  key: 'endingBalanceDetailedSt',
  get: ({ get }) => {
    const { initialBalance, inputs, outputs } = get(detailedMovesSt)
    let initial = initialBalance
    inputs.forEach((input) => {
      const real =
        input.retention == Retention.Yes ? input.amount_net : input.amount
      initial += real ?? 0
    })
    outputs.forEach((output) => {
      const real =
        output.retention == Retention.Yes ? output.amount_net : output.amount
      initial -= real ?? 0
    })
    return Number(initial.toFixed(2))
  },
})
