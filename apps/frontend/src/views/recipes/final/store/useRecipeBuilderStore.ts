import { create } from 'zustand'
import { IItemUI, Size } from '@/views/recipes/shared/types'

// El tipo extendido para el store
export type IngredientType = 'base' | 'sabor' | 'insumo'

export interface ISelectedIngredient {
  item_id: number
  name: string
  quantity: number
  measure_id: number
  presentation_id: number
  type: IngredientType
}

interface RecipeBuilderStore {
  selected: ISelectedIngredient[]
  factor: number
  productoId: number | null
  recetaBaseId: number | null
  tamanios: Size[]
  recipeFlavorId: number | null  
  recipeGroup: string

  setFactor: (f: number) => void
  setProductoId: (id: number) => void
  setRecetaBaseId: (id: number) => void
  setTamanios: (sizes: Size[]) => void
  setRecipeFlavorId: (id: number) => void
  setRecipeGroup: (group: string) => void

  add: (i: ISelectedIngredient) => void
  remove: (item_id: number, type: IngredientType) => void
  reset: () => void
  clearIngredients: () => void
}

export const useRecipeBuilderStore = create<RecipeBuilderStore>((set) => ({
  selected: [],
  factor: 1,
  productoId: null,
  recetaBaseId: null,
  tamanios: [],
  recipeFlavorId: null,
  recipeGroup: '',

  setFactor: (f) => set({ factor: f }),
  setProductoId: (id) => set({ productoId: id }),
  setRecetaBaseId: (id) => set({ recetaBaseId: id }),
  setTamanios: (sizes) => set({ tamanios: sizes }),
  setRecipeFlavorId: (id) => set({ recipeFlavorId: id }),
  setRecipeGroup: (name) => set({ recipeGroup: name }),

  add: (i) =>
    set((state) => ({
      selected: [...state.selected, i],
    })),

  remove: (item_id, type) =>
    set((state) => ({
      selected: state.selected.filter(
        (i) => i.item_id !== item_id || i.type !== type
      ),
    })),

  reset: () =>
    set({
      selected: [],
      factor: 1,
      productoId: null,
      recetaBaseId: null,
      tamanios: [],
    }),
    clearIngredients: () => set((state) => ({ ...state, selected: [] })),

}))