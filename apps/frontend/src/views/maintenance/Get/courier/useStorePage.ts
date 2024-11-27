import { create } from 'zustand'

import { Filters3 } from '@/data/types/Filters'

import { ICourier } from './types'

interface CourierStore {
  filters: Filters3<ICourier>
  setFilters: (filters: Filters3<ICourier>) => void
  reload: number
  refetch: () => void
  cleanFilters: () => void
}

export const useCourierStore = create<CourierStore>((set, get) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  reload: 0,
  refetch: () => set((state) => ({ reload: state.reload + 1 })),
  cleanFilters: () => {
    const newReload = get().reload + 1
    set({ filters: {}, reload: newReload })
  },
}))
