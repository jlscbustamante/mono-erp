import config from "@/config"
import { ITEM } from "@/const/localStorageItems"
import { IBaseRecipe, IFinalRecipe, IFlavorRecipe, ISupplies } from "../type/Recipe"
import { baseUrl } from "@/data/api/baseUrl"



export const getFinalRecipes = async () => {
    return baseUrl<IFinalRecipe[]>('recipe/finalRecipes/get', {
        method: 'GET'
    })
}

export const getBasicRecipes = async () => {
    return baseUrl<IBaseRecipe[]>('recipe/basicRecipe/get',{
        method: 'GET'
    })
}


export const getFlavorRecipes = async () => {
    return baseUrl<IFlavorRecipe[]>('recipe/flavorRecipe/get',{
        method: 'GET'
    })
}

export const getFlavorRecipesByTypeDish = async (dishType: string) => {
    return baseUrl<IFlavorRecipe[]>(`recipe/flavorRecipe/get?dishType=${dishType}`,{
        method: 'GET'
    })
}

export const createFinalRecipe = async (data: Partial<IFinalRecipe>) => {
    return baseUrl<IFinalRecipe>('recipe/finalRecipes/create', {
        method: 'POST',
        body: data
    })
}

export const getSupplies = async () => {
    return baseUrl<ISupplies>('recipe/supplies/get', {
        method: 'GET'
    })
}

export const editFinalRecipe = async (finalRecipe: Partial<IFinalRecipe>) => {
    return baseUrl<void>(`recipe/finalRecipes/edit`, {
        method: 'PUT',
        body: finalRecipe
    })
}





export const updateBaseRecipe = async (baseRecipeID: string, updateData: IBaseRecipe) => {

    const token = localStorage.getItem(ITEM.TOKEN)
    try {
        const response = await fetch(`${config.API}/recipes/update-base-recipe?recipeId=${baseRecipeID}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        })

        if (response.ok) {
            const responseData = await response.json()

            console.log('Datos actualizados:', responseData)
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

