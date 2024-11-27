import { create } from 'zustand'

import { IInvStock } from '@/data/products/types'
import { IUserFilters3 } from '@/data/types/Filters'

type States = {
  filters: IUserFilters3<IInvStock>
  pagination: {
    page: number
    lot: number
  }
}
type Actions = {
  setFilters: (filters: IUserFilters3<IInvStock>) => void
  setPagination: (pagination: { page: number; lot: number }) => void
}

export const useStockStore = create<States & Actions>((set) => ({
  filters: {},
  pagination: {
    page: 1,
    lot: 15,
  },
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) => set({ pagination }),
}))
