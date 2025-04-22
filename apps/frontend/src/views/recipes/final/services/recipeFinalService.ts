import { CreateBaseRecipeDto, CreateFlavorWithIngredientsDto } from '../../shared/dtos/CreateRecipe.dto'
import { IFinalRecipePayload, IItem, IProduct, IRecipeBase, IRecipeFlavor, IRecipeFlavorIngredient, Size } from '../../shared/types'

export const getProducts = async (): Promise<IProduct[]> => {
  return [
    { id: 1, product: 'Pizza', menuprod_id: 100, status: 1 },
    { id: 2, product: 'Lasaña', menuprod_id: 101, status: 1 }
  ]
}

export const getSizes = async (): Promise<Size[]> => {
  return [
    { id: 1, name: 'Pequeño', factor: 1 },
    { id: 2, name: 'Mediano', factor: 1.5 },
    { id: 3, name: 'Grande', factor: 2 }
  ]
}

export const getBaseRecipes = async (): Promise<IRecipeBase[]> => {
  return [
    {
      id: 1,
      company_id: 'XYZ',
      title: 'Masa Clásica',
      product_size_id: 1,
      status: 1,
      created_at: '',
      updated_at: '',
      ingredients: [
        {
          id: 101,
          recipe_base_id: 1,
          item_id: 1,
          quantity: 0.3,
          measure_id: 1,
          presentation_id: 1,
          item_name: 'Harina',
          measure_name: 'kg',
          presentation_name: 'Bolsa',
          created_at: '',
          updated_at: ''
        }
      ]
    }
  ]
}

export const getFlavors = async (): Promise<IRecipeFlavor[]> => {
  return [
    {
      id: 1,
      flavor_id: 1,
      flavor: 'Jamón',
      ingredients: [
        {
          id: 201,
          flavor_id: 1,
          item_id: 2,
          quantity: 0.05,
          measure_id: 1,
          presentation_id: 2,
          item_name: 'Jamón Inglés',
          measure_name: 'kg',
          presentation_name: 'Paquete',
          created_at: '',
          updated_at: ''
        }
      ]
    }
  ]
}

export const getSupplies = async (): Promise<IItem[]> => {
  return [
    { id: 301, name: 'Caja de pizza', quantity: 1, measure_id: 3, presentation_id: 1 },
    { id: 302, name: 'Vaso descartable', quantity: 1, measure_id: 3, presentation_id: 2 }
  ]
}


export const createFinalRecipe = async (
  payload: IFinalRecipePayload
): Promise<{ success: boolean }> => {
  console.log('📦 Enviando receta final al backend:', payload)
  // Simulación: tiempo de espera
  await new Promise((resolve) => setTimeout(resolve, 600))

  return { success: true }
}


export const createBaseRecipe = async (
  payload: CreateBaseRecipeDto
): Promise<any> => {
  console.log('📦 Enviando receta base...', payload)
  await new Promise(resolve => setTimeout(resolve, 600))
  return {
    ...payload,
    id: Math.floor(Math.random() * 1000),
    status: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

import { IProductFlavor } from "@/views/recipes/shared/types"

export const createFlavor = async (
  flavor: Pick<IProductFlavor, "flavor" | "menuflav_id">
): Promise<IProductFlavor> => {
  console.log('🌈 Creando nuevo sabor:', flavor)
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    id: Math.floor(Math.random() * 1000),
    status: 1,
    company_id: "xyz",
    ...flavor
  }
}


export const addIngredientToFlavor = async (
  ingredient: Omit<IRecipeFlavorIngredient, 'id' | 'created_at' | 'updated_at'>
): Promise<IRecipeFlavorIngredient> => {
  console.log('➕ Agregando ingrediente a sabor:', ingredient)
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    id: Math.floor(Math.random() * 1000),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...ingredient
  }
}

// Simulación futura con filtro: `?category_id=X`
export const getItems = async (categoryId?: number): Promise<IItem[]> => {
  // Simulación con datos dummy — lista parcial de tu inv_item:
  const dummyItems: IItem[] = [
    {
      id: 2,
      name: "HARINA MAIZ - CORINA - BOLSA X KG",
      quantity: 1,
      measure_id: 1,
      presentation_id: 1
    },
    {
      id: 3,
      name: "SALSA BBQ - KOMEX - BOLSA X KG",
      quantity: 1,
      measure_id: 1,
      presentation_id: 1
    },
    {
      id: 4,
      name: "ASADO DE POLLO - PIERRE'S",
      quantity: 1,
      measure_id: 1,
      presentation_id: 1
    },
    {
      id: 15,
      name: "CHOCLITO - DEL MONTE - LATA 150GR",
      quantity: 1,
      measure_id: 1,
      presentation_id: 9
    }
  ]

  if (categoryId) {
    // simulación: retornamos los pares
    return dummyItems.filter((_, idx) => idx % 2 === 0)
  }

  return dummyItems
}

export const createFlavorWithIngredients = async (
  payload: CreateFlavorWithIngredientsDto
): Promise<any> => {
  console.log('🌈 Enviando sabor con ingredientes:', payload)
  await new Promise(resolve => setTimeout(resolve, 600))
  return {
    id: Math.floor(Math.random() * 1000),
    ...payload.flavor,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 1,
  }
}