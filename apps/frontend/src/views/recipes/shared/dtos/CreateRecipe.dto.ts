export interface CreateBaseRecipeIngredientDto {
    item_id: number
    quantity: number
    measure_id: number
    presentation_id: number
  }
  
  export interface CreateBaseRecipeDto {
    company_id: string
    title: string
    product_size_id: number
    ingredients: CreateBaseRecipeIngredientDto[]
  }
  
  export interface CreateFlavorDto {
    flavor: string
    menuflav_id: number
    company_id: string
  }
  
  export interface CreateFlavorIngredientDto {
    item_id: number
    quantity: number
    measure_id: number
    presentation_id: number
  }
  
  export interface CreateFlavorWithIngredientsDto {
    flavor: CreateFlavorDto
    ingredients: CreateFlavorIngredientDto[]
  }