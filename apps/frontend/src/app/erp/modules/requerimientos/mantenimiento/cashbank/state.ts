import { CashBankSelect, WhereOption } from '@pizzadb'
import { create } from 'zustand'

interface Store {
  filters: WhereOption<CashBankSelect>[]
  setFilters: (filters: WhereOption<CashBankSelect>[]) => void
}

export const useCashBank = create<Store>((set) => {
  return {
    filters: [],
    setFilters: (filters) => {
      return set({ filters })
    },
  }
})
