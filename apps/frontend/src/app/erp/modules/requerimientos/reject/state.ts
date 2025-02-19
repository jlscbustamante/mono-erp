import { RequirementItemSelect, WhereOption } from '@pizzadb'
import { REQUIREMENT_STATUS } from '@view'
import dayjs from 'dayjs'
import { create } from 'zustand'

export type ViewType = 'list' | 'calendar'
interface Store {
  filters: WhereOption<RequirementItemSelect>[]
  setFilters: (filters: WhereOption<RequirementItemSelect>[]) => void
  view: ViewType
  setView: (view: ViewType) => void
}

export const useRejectedStore = create<Store>((set) => ({
  view: 'list',
  setView: (view) => {
    return set({ view })
  },
  filters: [
    {
      field: 'rejected_at',
      key: 'rejected_at',
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
      value: [REQUIREMENT_STATUS.CANCELLED],
    },
  ],
  setFilters: (filters) => {
    return set({ filters: filters })
  },
}))
