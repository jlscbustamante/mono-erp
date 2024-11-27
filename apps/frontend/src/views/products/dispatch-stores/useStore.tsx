import { create } from 'zustand'

export const useStore = create<{
  filterDescription: string
  setFilterDescription: (description: string) => void
}>((set) => ({
  filterDescription: '',
  setFilterDescription: (description: string) =>
    set({ filterDescription: description }),
}))
