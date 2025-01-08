import dayjs from 'dayjs'
import { create } from 'zustand'

interface IStore {
  date: string
  changeDate: (date: string) => void
  data: any
  setData: any
}

export const useNotaCreditoStore = create<IStore>((set) => ({
  date: dayjs().format('YYYY-MM-DD'),
  changeDate: (date: string) => set({ date }),
  data: null,
  setData: null,
}))
