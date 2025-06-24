import { IAdmRequirementWithSupplierBank } from '@types'
import { create } from 'zustand'

interface IStore {
  requirements: IAdmRequirementWithSupplierBank[]
  set_requirements: (requirements: IAdmRequirementWithSupplierBank[]) => void
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
