import { create } from 'zustand'

export interface TemplateBase {
  id: number
  name: string
  type: string
}

interface Store {
  editStore: TemplateBase | undefined
  setStoreId: (element: TemplateBase | undefined) => void
}

export const useStoreTemplate = create<Store>((set) => ({
  editStore: undefined,
  setStoreId: (element) => set({ editStore: element }),
}))
