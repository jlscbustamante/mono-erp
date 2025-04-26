export const medidas = {
  1: 'kg',
  2: 'gr',
  3: 'unidad',
  4: 'ml',
}

export interface Size {
  id: number
  name: string
  factor: number
}

export interface IProductSize {
  id?: number
  size: string
  factor?: number
  is_ref?: boolean
  menusize_id: number
  status?: number
  company_id?: string
}

// 🍕 Producto
export interface IProduct {
  id: number
  product: string
  menuprod_id: number
  status?: number
  company_id?: string
  flavor_id?: number
  size_id?: number

  // nuevos campos
  flavor_name?: string
  size_name?: string
}

// 🌈 Sabor de producto
export interface IProductFlavor {
  id?: number
  flavor: string
  menuflav_id: number
  status?: number
  company_id?: string
}

// 🧂 Insumo o Ingrediente
export interface IItem {
  id: number
  name: string
  quantity: number
  measure_id: number
  presentation_id: number
}

// 🧱 Receta Base (estructura general)
export interface IRecipeBase {
  id: number
  company_id: string
  title: string
  product_size_id: number
  status: number
  created_at: string
  updated_at: string
  ingredients: IRecipeBaseIngredient[] // agregamos ingredientes ya cargados
}

export interface IRecipeBaseIngredient {
  id: number // id de inv_recipemix_base
  recipe_base_id: number
  item_id: number
  quantity: number
  measure_id: number
  presentation_id: number
  created_at: string
  updated_at: string

  // Datos cargados de item:
  item_name: string // item_name de inv_item
  measure_name: string // nombre de unidad (opcional)
  presentation_name: string // nombre presentación (opcional)
}

// 🌈 Receta por sabor
export interface IRecipeFlavor {
  id: number
  flavor_id: number
  flavor: string
  ingredients: IRecipeFlavorIngredient[]
}

export interface IRecipeFlavorIngredient {
  id: number // id en inv_recipemix_flavor
  flavor_id: number
  item_id: number
  quantity: number
  measure_id: number
  presentation_id: number
  created_at: string
  updated_at: string

  // Enriquecido
  item_name: string
  measure_name?: string
  presentation_name?: string
}

// 🧾 Payload final de receta para guardar
export interface IFinalRecipePayload {
  product_id: number
  product_size_id: number
  recipe_base_id: number
  recipe_flavor_id: number | null
  ingredients: {
    item_id: number
    quantity: number
    measure_id: number
    presentation_id: number
    source: 'base' | 'flavor' | 'extra' // para identificar de dónde viene
  }[]
}

export interface IFinalRecipeSummary {
  id: number
  product: IProduct
  size: IProductSize
  base: IRecipeBase
  flavor: IProductFlavor | null
  created_at: string
  status: number
}

export interface IItemUI extends IItem {
  name: string
  type: 'base' | 'sabor' | 'insumo'
}
/*-----------------------*/

export interface IFilterRecipe {
  id?: number
  product?: IProduct
  flavor?: IProductFlavor
  size?: IProductSize
  status?: number
  created_at?: string
}