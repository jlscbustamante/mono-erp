import { RequirementSelect, WhereOption } from '@pizzadb'
import { REQUIERMENT_TYPE, REQUIREMENT_STATUS } from '@view'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { ViewType } from '../components/view-type.interface'

interface Store {
  filters: WhereOption<RequirementSelect>[]
  setFilters: (filters: WhereOption<RequirementSelect>[]) => void
  view: ViewType
  setView: (view: ViewType) => void
  controlRefetch: number
  refetch: () => void
  dateCalendar: string
  setDateCalendar: (date: string) => void
}

export const useApprovedStore = create<Store>((set, get) => ({
  dateCalendar: format(new Date(), 'yyyy-MM-dd'),
  setDateCalendar: (date) => {
    return set({ dateCalendar: date })
  },
  view: 'calendar',
  setView: (view) => {
    return set({ view })
  },
  filters: [
    {
      field: 'request_type',
      key: 'request_type',
      operator: 'equal',
      value: REQUIERMENT_TYPE.SUPPLIER,
    },
    {
      field: 'requested_at',
      key: 'requested_at',
      operator: 'range',
      useMods: true,
      value: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      mods: {
        field: ['DATE'],
      },
    },
    {
      field: 'status',
      key: 'status',
      operator: 'in',
      value: [REQUIREMENT_STATUS.PAID, REQUIREMENT_STATUS.APPROVED],
    },
  ],
  setFilters: (filters) => {
    return set({ filters: filters })
  },
  controlRefetch: 0,
  refetch: () => {
    return set({ controlRefetch: get().controlRefetch + 1 })
  },
}))
