import { format } from 'date-fns'
import { create } from 'zustand'

interface Store {
  dates: [string, string]
  set_dates: (dates: [string, string]) => void
  company_id: string | undefined
  set_company_id: (company_id: string | undefined) => void
  control_refetch: number
  refetch: () => void
}

export const use_cost_center = create<Store>((set, get) => ({
  dates: [format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')],
  company_id: undefined,
  set_company_id: (company_id) => set({ company_id }),
  set_dates: (dates) => set({ dates }),
  control_refetch: 0,
  refetch: () => set({ control_refetch: get().control_refetch + 1 }),
}))
