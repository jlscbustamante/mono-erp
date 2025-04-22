import { IFinalRecipePayload } from "../../shared/types"
import { ISelectedIngredient } from "../store/useRecipeBuilderStore"

interface BuildPayloadParams {
  product_id: number
  product_size_id: number
  recipe_base_id: number
  recipe_flavor_id: number | null
  factor: number
  selected: ISelectedIngredient[]
}

export const buildFinalRecipePayload = ({
  product_id,
  product_size_id,
  recipe_base_id,
  recipe_flavor_id,
  factor,
  selected
}: BuildPayloadParams): IFinalRecipePayload => {
  return {
    product_id,
    product_size_id,
    recipe_base_id,
    recipe_flavor_id,
    ingredients: selected.map((i) => ({
      item_id: i.item_id,
      quantity: i.type === 'insumo' 
        ? i.quantity 
        : Number((i.quantity * factor).toFixed(3)),
      measure_id: i.measure_id,
      presentation_id: i.presentation_id,
      source: i.type === 'base' 
        ? 'base' 
        : i.type === 'sabor' 
        ? 'flavor' 
        : 'extra'
    }))
  }
}
