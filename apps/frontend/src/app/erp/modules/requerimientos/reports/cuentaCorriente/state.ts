import { RequirementSelect, WhereOption } from '@pizzadb'
import { format } from 'date-fns'
import { create } from 'zustand'

export interface ItemReport {
  isSummary?: boolean
  key: string | number
  requestType: string
  docNumber: string
  requestedAt: string
  legalName: string
  subTitle: string
  amount: number | string
}

interface IStore {
  refetch: () => void
  controlRefetch: number
  filters: WhereOption<RequirementSelect>[]
  setFilters: (filters: WhereOption<RequirementSelect>[]) => void
}

export const useSupplierAccount = create<IStore>((set, get) => ({
  refetch: () => set({ controlRefetch: get().controlRefetch + 1 }),
  controlRefetch: 0,
  filters: [
    {
      field: 'requested_at',
      key: 'requested_at',
      operator: 'range',
      useMods: true,
      value: [
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
      ],
      mods: {
        field: 'DATE',
      },
    },
  ],
  setFilters: (filters) => set({ filters }),
}))
