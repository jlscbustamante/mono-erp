import { baseUrl } from "@/data/api/baseUrl"
import { IBaseRecipe } from "../../shared/types"

export const getAllBaseRecipes = async (): Promise<IBaseRecipe[]> => {
  return baseUrl<IBaseRecipe[]>('/api/view/recipe/base/get', {
    method: 'GET',
    useV2: true,
  })
}