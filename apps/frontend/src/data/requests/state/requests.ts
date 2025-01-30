import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil'

import { IFilteredRequest, Retention } from '@/data/requests/types/'

export const pendingRequestsSt: RecoilState<IFilteredRequest[]> = atom({
  key: 'requestsPendingState',
  default: [] as IFilteredRequest[],
})

export const approvedRequestsSt: RecoilState<IFilteredRequest[]> = atom({
  key: 'requestsApprovedState',
  default: [] as IFilteredRequest[],
})

export const rejectedRequestsSt: RecoilState<IFilteredRequest[]> = atom({
  key: 'requestsRejectedState',
  default: [] as IFilteredRequest[],
})

export const sumPendingRequestsSt: RecoilValueReadOnly<[number, number]> =
  selector({
    key: 'sumPendingRequests',
    get: ({ get }) => {
      const requests = get(pendingRequestsSt)
      // [sin retencion, con retencion]
      const sum: [number, number] = [0, 0]
      requests.forEach((request) => {
        if (!request.currency || request.currency == 'PEN') {
          sum[0] = sum[0] + request.amount
        } else if (request.currency == 'USD') {
          sum[1] = sum[1] + request.amount
        }

        // sum[1] = sum[1] + request.amount

        // if (request.retention == Retention.Yes) {
        //   sum[0] = sum[0] + (request.amount_net ?? 0)
        // } else {
        //   sum[0] = sum[0] + request.amount
        // }
      })

      return sum
    },
  })

export const sumApprovedRequestsSt: RecoilValueReadOnly<[number, number]> =
  selector({
    key: 'sumApprovedRequests',
    get: ({ get }) => {
      const requests = get(approvedRequestsSt)
      // [sin retencion, con retencion]
      const sum: [number, number] = [0, 0]
      requests.forEach((request) => {
        if (!request.currency || request.currency == 'PEN') {
          sum[0] = sum[0] + request.amount
        } else if (request.currency == 'USD') {
          sum[1] = sum[1] + request.amount
        }
        // sum[1] = sum[1] + request.amount
        // if (request.retention == Retention.Yes) {
        //   sum[0] = sum[0] + (request.amount_net ?? 0)
        // } else {
        //   sum[0] = sum[0] + request.amount
        // }
      })

      return sum
    },
  })

export const sumRejectedRequestsSt: RecoilValueReadOnly<[number, number]> =
  selector({
    key: 'sumRejectedRequests',
    get: ({ get }) => {
      const requests = get(rejectedRequestsSt)
      // [sin retencion, con retencion]
      const sum: [number, number] = [0, 0]
      requests.forEach((request) => {
        sum[1] = sum[1] + request.amount
        if (request.retention == Retention.Yes) {
          sum[0] = sum[0] + (request.amount_net ?? 0)
        } else {
          sum[0] = sum[0] + request.amount
        }
      })

      return sum
    },
  })
