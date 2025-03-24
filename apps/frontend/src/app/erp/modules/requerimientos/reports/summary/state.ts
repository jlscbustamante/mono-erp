import { format } from 'date-fns'
import { create } from 'zustand'

interface IStore {
  date: string
  set_date: (date: string) => void
  company_id: string | undefined
  set_company_id: (company_id: string | undefined) => void
  refetch: () => void
  control_refetch: number
  show_with_moves: boolean
  set_show_with_moves: (show_with_moves: boolean) => void
  show_with_balance: boolean
  set_show_with_balance: (show_with_balance: boolean) => void
}

export const use_summary_store = create<IStore>((set, get) => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  set_date: (date: string) => set({ date }),
  company_id: 'PIZZARAUL',
  set_company_id: (company_id: string | undefined) => set({ company_id }),
  control_refetch: 0,
  refetch: () => set({ control_refetch: get().control_refetch + 1 }),
  show_with_moves: false,
  set_show_with_moves: (show_with_moves: boolean) => set({ show_with_moves }),
  show_with_balance: false,
  set_show_with_balance: (show_with_balance: boolean) =>
    set({ show_with_balance }),
}))
