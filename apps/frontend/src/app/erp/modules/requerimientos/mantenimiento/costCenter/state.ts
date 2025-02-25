import { CostCenterSelecet, WhereOption } from '@pizzadb'
import { create } from 'zustand'

interface Store {
  filters: WhereOption<CostCenterSelecet>[]
  setFilters: (filters: WhereOption<CostCenterSelecet>[]) => void
}

export const useCostCenter = create<Store>((set) => {
  return {
    filters: [],
    setFilters: (filters) => {
      return set({ filters })
    },
  }
})
