import { RequirementItemSelect, WhereOption } from '@pizzadb'
import { REQUIREMENT_STATUS } from '@view'
import dayjs from 'dayjs'
import { create } from 'zustand'

interface Store {
  filters: WhereOption<RequirementItemSelect>[]
  setFilters: (filters: WhereOption<RequirementItemSelect>[]) => void
}

export const useApprovedStore = create<Store>((set) => ({
  filters: [
    {
      field: 'approved_at',
      key: 'approved_at',
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
