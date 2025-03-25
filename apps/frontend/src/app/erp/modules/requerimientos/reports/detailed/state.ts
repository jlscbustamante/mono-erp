import { format } from 'date-fns'
import { create } from 'zustand'

interface IStore {
  date: string
  cashId: number | undefined
  setDate: (date: string) => void
  company_id: string | undefined
  set_company_id: (company_id: string | undefined) => void
  setCashId: (cashId: number) => void
  refetch: () => void
  controlRefetch: number
}

export const useDetailedStore = create<IStore>((set, get) => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  cashId: undefined,
  company_id: undefined,
  set_company_id: (company_id) => set({ company_id }),
  setDate: (date) => set({ date }),
  setCashId: (cashId) => set({ cashId }),
  controlRefetch: 0,
  refetch: () => set({ controlRefetch: get().controlRefetch + 1 }),
}))
