import { IRequest } from '@/data/requests'
import { Filters } from '@/data/types/Filters'
import { format } from 'date-fns'
import { atom, RecoilState } from 'recoil'
import { create } from 'zustand'

export const filterRequirementsSt: RecoilState<Filters<IRequest>> = atom({
  key: 'filterRequirementsDigit',
  default: {} as Filters<IRequest>,
})

interface IStore {
  date: [string, string]
  setDate: (date: [string, string]) => void
}

export const uploadStore = create<IStore>((set) => ({
  date: [format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')],
  setDate: (date) => set({ date }),
}))
