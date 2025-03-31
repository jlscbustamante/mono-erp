import { Filters3 } from '@/data/types/Filters'
import { format } from 'date-fns'
import { create } from 'zustand'

interface IStore {
  dates: [string, string]
  set_dates: (start: string, end: string) => void
  control_refetch: number
  refetch: () => void
  filters: Filters3<any>
  set_filters: (filters: Filters3<any>) => void
}

export const use_report_store = create<IStore>((set, get) => ({
  dates: [format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')],
  set_dates: (start: string, end: string) => {
    set({ dates: [start, end] })
  },
  control_refetch: 0,
  refetch: () => {
    set({ control_refetch: get().control_refetch + 1 })
  },
  filters: {},
  set_filters: (filters: Filters3<any>) => {
    set({ filters })
  },
}))
