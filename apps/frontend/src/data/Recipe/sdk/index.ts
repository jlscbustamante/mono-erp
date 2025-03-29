import config from "@/config"
import { ITEM } from "@/const/localStorageItems"
import { IBaseRecipe } from "../type/Recipe"



export const getFinalRecipes = async () =>{
    const token = localStorage.getItem(ITEM.TOKEN)
    try {
        const response = await fetch(`${config.API}/recipes/get-final-recipes`,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })

        if(!response.ok){
            throw new Error('Error al obtener las recetas finales.')
        }

        const data = await response.json();
        
        if(!Array.isArray(data)){
            throw new Error('Los datos obtenidos no tienen el formato correcto.')
        }

        return data;
    } catch (error) {
        console.error('Error al obtener las recetas finales.');
        throw error;
    }
}

export const getBasicRecipes = async () => {

    const token = localStorage.getItem(ITEM.TOKEN)
    try {
        const response = await fetch(`${config.API}/recipes/get-basic-recipes`,{ 
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
        
        if (!response.ok) {
            throw new Error('Error al obtener las recetas')
        }

        const data = await response.json()

        if(!Array.isArray(data)){
            throw new Error('Los datos obtenidos no tienen el formato correcto')
        }

        return data
    } catch(error){
        console.error('Error al obtener las recetas:', error)
        throw error
    }

}

export const getFlavorsByTypeDish = async (dishType: string) => {
    const token = localStorage.getItem(ITEM.TOKEN)

    try{
        const response = await fetch(
            `${config.API}/recipes/get-flavor?dish-type=${dishType}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                method: 'GET'
            }
        )

        if(!response.ok){
            throw new Error('Error al obtener los sabores del producto.')
        }

        const data = await response.json()

        if(!Array.isArray(data)){
            throw new Error("Los datos obtenidos tienen el formato incorrecto")
        }

        return data;

    }catch(error){
        console.log('Error al obtener los datos del sabor: ', error);
        throw error
    }
}

export const getSupplies = async () => {
const token = localStorage.getItem(ITEM.TOKEN)

    try {
        const response = await fetch(`${config.API}/get-suppliers`,{
            headers:{
                Autorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            method: 'GET'
        })

        if(!response.ok){
            throw new Error('Error al obtener lista de insumos.')
        }

        const data = await response.json()

        if(!Array.isArray(data)){
            throw new Error('Los datos obtenidos no tienen el formato correcto')
        }

        return data;
    } catch (error) {
        console.error('Error al obtener los datos de insumos.');
        throw error;
    }
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

