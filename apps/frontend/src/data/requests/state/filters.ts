import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

import {
  ICountFilterResponse,
  IRequest,
  RequestType,
} from '@/data/requests/types/'
import { Filters } from '@/data/types/Filters'

import { RequestStatus } from '../types/status'

export const filtersFieldsRequestSt: RecoilState<Set<keyof IRequest>> = atom({
  key: 'filtersFieldsRequest',
  default: new Set(),
})

export const dateSimpleFilterSt: RecoilState<[string, string]> = atom({
  key: 'requestDayFilter',
  default: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
})

export const dateApprovedFilterSt: RecoilState<[string, string]> = atom({
  key: 'requestDayApprovedFilter',
  default: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
})
export const dateRejectedFilterSt: RecoilState<[string, string]> = atom({
  key: 'requestDayRejectedFilter',
  default: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
})

export const statusFilterSt = atom({
  key: 'requestStatusFilter',
  default: [RequestStatus.Pending],
})

export const typeFilterSt = atom({
  key: 'requestTypeFilter',
  default: RequestType.Simple,
})

export const approvedTypeFilterSt = atom({
  key: 'approvedTypeFilter',
  default: RequestType.Simple,
})

export const pendingTypeFilterSt = atom({
  key: 'pendingTypeFilter',
  default: RequestType.Simple,
})

export const rejectedTypeFilterSt = atom({
  key: 'rejectedTypeFilter',
  default: RequestType.Simple,
})

// ahora los filtros del usuario
export const filtersUserRequestedSt: RecoilState<Filters<IRequest>> = atom({
  key: 'filtersUserPendingRequests',
  default: {} as Filters<IRequest>,
})

export const filtersUserApprovedSt: RecoilState<Filters<IRequest>> = atom({
  key: 'filtersUserApprovedRequests',
  default: {} as Filters<IRequest>,
})

export const filtersUserRejectedSt: RecoilState<Filters<IRequest>> = atom({
  key: 'filtersUserRejectedRequests',
  default: {} as Filters<IRequest>,
})

// conteo de las respuestas
export const countFiltersRequestedSt: RecoilState<ICountFilterResponse> = atom({
  key: 'countFiltersRequested',
  default: {} as ICountFilterResponse,
})

export const countFiltersApprovedSt: RecoilState<ICountFilterResponse> = atom({
  key: 'countFiltersApproved',
  default: {} as ICountFilterResponse,
})

export const countFiltersRejectedSt: RecoilState<ICountFilterResponse> = atom({
  key: 'countFiltersRejected',
  default: {} as ICountFilterResponse,
})
