import { IFinalRecipePayload } from "../../shared/types"
import { ISelectedIngredient } from "../store/useRecipeBuilderStore"

interface Params {
    product_id: number
    product_size_id: number
    recipe_base_id: number
    recipe_flavor_id: number | null
    factor: number
    selected: ISelectedIngredient[]
  }

  const mapSource = (type: 'base' | 'sabor' | 'insumo'): 'base' | 'flavor' | 'extra' => {
    if (type === 'base') return 'base'
    if (type === 'sabor') return 'flavor'
    return 'extra'
  }
  
  export const buildFinalRecipePayload = ({
    product_id,
    product_size_id,
    recipe_base_id,
    recipe_flavor_id,
    factor,
    selected,
  }: Params): IFinalRecipePayload => {
    const ingredients = selected.map((i) => ({
      item_id: i.item_id,
      quantity:
        i.type === "insumo"
          ? i.quantity
          : Number((i.quantity * factor).toFixed(3)),
      measure_id: i.measure_id,
      presentation_id: i.presentation_id,
      source: mapSource(i.type)
    }))
  
    return {
      product_id,
      product_size_id,
      recipe_base_id,
      recipe_flavor_id,
      ingredients,
    }
  }