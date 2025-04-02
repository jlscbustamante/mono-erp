import { create } from 'zustand'
import { IItem } from '../../shared/types'


type IngredientType = 'base' | 'sabor' | 'insumo'

export interface ISelectedIngredient extends IItem {
  type: IngredientType
}

interface RecipeBuilderStore {
  selected: ISelectedIngredient[]
  factor: number
  recetaBaseId: number | null
  setFactor: (f: number) => void
  setRecetaBaseId: (id: number) => void
  add: (i: ISelectedIngredient) => void
  remove: (name: string, type: IngredientType) => void
  reset: () => void
  
}

export const useRecipeBuilderStore = create<RecipeBuilderStore>((set) => ({
  selected: [],
  factor: 1,
  recetaBaseId: null,
  setFactor: (f) => set({ factor: f }),
  setRecetaBaseId: (id: number) => set({ recetaBaseId: id }),
  add: (i) =>
    set((state) => ({
      selected: [...state.selected, i],
    })),
  remove: (name, type) =>
    set((state) => ({
      selected: state.selected.filter((i) => i.name !== name || i.type !== type),
    })),
  reset: () => set({ selected: [], factor: 1, recetaBaseId: null }),
}))
