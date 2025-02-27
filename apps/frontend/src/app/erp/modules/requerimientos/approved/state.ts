import { RequirementSelect, WhereOption } from '@pizzadb'
import { REQUIREMENT_STATUS } from '@view'
import dayjs from 'dayjs'
import { create } from 'zustand'

export type ViewType = 'list' | 'calendar'
interface Store {
  filters: WhereOption<RequirementSelect>[]
  setFilters: (filters: WhereOption<RequirementSelect>[]) => void
  view: ViewType
  setView: (view: ViewType) => void
}

export const useApprovedStore = create<Store>((set) => ({
  view: 'calendar',
  setView: (view) => {
    return set({ view })
  },
  filters: [
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
}))
