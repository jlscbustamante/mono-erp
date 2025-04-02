
import { baseUrl } from "@/data/api/baseUrl";
import { IFinalRecipe, IFlavorRecipe, ISupplies } from "@/views/recipes/shared/types";


export const getFinalRecipes = async() =>{
    return baseUrl<IFinalRecipe[]>('api/view/recipe/finalRecipes/get',{
        method: 'GET',
        useV2: true
    })    
}

export const editFinalRecipe = async(recipe: Partial<IFinalRecipe>) =>{
    return baseUrl<IFinalRecipe>('api/view/recipe/finalRecipes/update',{
        method: 'PUT',
        body: JSON.stringify(recipe),
        useV2: true
    })
}

export const getFlavorsByBaseId = async (baseId: number): Promise<IFlavorRecipe[]> => {
    return baseUrl<IFlavorRecipe[]>(`/api/view/recipe/flavor/getByBaseId/${baseId}`, {
      method: "GET",
      useV2: true,
    })
}

export const getAllSupplies = async (): Promise<ISupplies[]> => {
    return baseUrl<ISupplies[]>('/api/view/recipe/supplies/getAll', {
      method: 'GET',
      useV2: true,
    })
  }