import { baseUrl } from "@/data/api/baseUrl"
import { IFinalRecipePayload, IFinalRecipeSummary, IItem, IProductFlavor, IRecipeBase, IRecipeFlavor } from "@/views/recipes/shared/types";


export const getAllBaseRecipes = async (): Promise<IRecipeBase[]> => {
  return baseUrl<IRecipeBase[]>('/api/view/recipe/base/get', {
    method: 'GET',
    useV2: true,
  })
}

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

export const getFlavorsByBaseId = async (baseId: number): Promise<IProductFlavor[]> => {
        return baseUrl<IProductFlavor[]>(`/api/view/recipe/flavor/getByBaseId/${baseId}`, {
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

export const createBaseRecipe = async (data: {
  title: string,
  product_size_ids: number[],
  ingredients: {
    item_id: number,
    quantity: number,
    measure_id: number,
    presentation_id: number
  }[]
}): Promise<any> => {
  return baseUrl('/api/view/recipe/base/create', {
    method: 'POST',
    body: JSON.stringify(data),
    useV2: true,
  })
}

export const createFlavorRecipe = async (data: {
  flavor: string,
  base_id: number,
  ingredients: {
    item_id: number,
    quantity: number,
    measure_id: number,
    presentation_id: number
  }[]
}): Promise<any> => {
  return baseUrl('/api/view/recipe/flavor/create', {
    method: 'POST',
    body: JSON.stringify(data),
    useV2: true
  })
}