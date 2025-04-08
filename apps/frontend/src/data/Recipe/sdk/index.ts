
import { baseUrl } from "@/data/api/baseUrl";
import { IFinalRecipePayload, IFinalRecipeSummary, IItem, IRecipeFlavor } from "@/views/recipes/shared/types";


export const getFinalRecipes = async (): Promise<IFinalRecipeSummary[]> => {
    return baseUrl<IFinalRecipeSummary[]>('api/view/recipe/finalRecipes/get', {
      method: 'GET',
      useV2: true,
    })
}

export const editFinalRecipe = async (recipe: IFinalRecipePayload): Promise<any> => {
        return baseUrl('/api/view/recipe/finalRecipes/update', {
          method: 'PUT',
          body: JSON.stringify(recipe),
          useV2: true,
        })
}

export const getFlavorsByBaseId = async (baseId: number): Promise<IRecipeFlavor[]> => {
    return baseUrl<IRecipeFlavor[]>(`/api/view/recipe/flavor/getByBaseId/${baseId}`, {
      method: 'GET',
      useV2: true,
    })
  }
export const getAllSupplies = async (): Promise<IItem[]> => {
    return baseUrl<IItem[]>('/api/view/recipe/supplies/getAll', {
      method: 'GET',
      useV2: true,
    })
}

export const createFinalRecipe = async (data: IFinalRecipePayload) => {
    return baseUrl('/api/view/recipe/finalRecipes/create', {
      method: 'POST',
      body: JSON.stringify(data),
      useV2: true,
    })
}