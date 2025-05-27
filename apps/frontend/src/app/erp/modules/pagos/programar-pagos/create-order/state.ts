import { AdmRequirementSelect } from '@types'
import { create } from 'zustand'

interface IStore {
  requirements: AdmRequirementSelect[]
  set_requirements: (requirements: AdmRequirementSelect[]) => void
}

export const useCreateOrderStore = create<IStore>((set) => {
  return {
    requirements: [],
    set_requirements: (requirements) => {
      set(() => ({
        requirements,
      }))
    },
  }
})
