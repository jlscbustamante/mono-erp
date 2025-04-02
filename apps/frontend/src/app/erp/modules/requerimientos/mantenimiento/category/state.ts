import { MoveCashSelect, WhereOption } from '@pizzadb'
import { create } from 'zustand'

interface Store {
  filters: WhereOption<MoveCashSelect>[]
  setFilters: (filters: WhereOption<MoveCashSelect>[]) => void
}

export const useCategory = create<Store>((set) => {
  return {
    filters: [],
    setFilters: (filters) => {
      return set({ filters })
    },
  }
})
