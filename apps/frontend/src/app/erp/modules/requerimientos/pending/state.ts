import { RequirementSelect, WhereOption } from '@pizzadb'
import dayjs from 'dayjs'
import { create } from 'zustand'

interface Store {
  filters: WhereOption<RequirementSelect>[]
  setFilters: (filters: WhereOption<RequirementSelect>[]) => void
}

export const usePendingStore = create<Store>((set) => ({
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
  ],
  setFilters: (filters) => {
    return set({ filters: filters })
  },
}))
