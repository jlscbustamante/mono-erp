import dayjs from 'dayjs'
import { create } from 'zustand'
import { NotaCredito } from './types'

interface IStore {
  date: string
  changeDate: (date: string) => void
  data: NotaCredito[]
  setData: (data: NotaCredito[]) => void
}

export const useNotaCreditoStore = create<IStore>((set) => ({
  date: dayjs().format('YYYY-MM-DD'),
  changeDate: (date: string) => set({ date }),
  data: [],
  setData: (data) => set({ data }),
}))
