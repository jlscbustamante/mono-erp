export interface IngredientDto {
    item_id: number;
    quantity: number;
    measure_id: number;
    presentation_id: number;
    source: 'base' | 'flavor' | 'extra';
  }
  
  export interface CreateFinalRecipeDto {
    product_id: number;
    product_size_id: number;
    recipe_base_id: number;
    recipe_flavor_id?: number;
    company_id: string;
    recipe_group: string;
    ingredients: IngredientDto[];
    status: number;
  }

  // Para receta base
export interface CreateBaseRecipeDto {
  title: string;
  product_size_id: number;
  company_id: string;
  ingredients: {
    item_id: number;
    quantity: number;
    measure_id: number;
    presentation_id: number;
  }[];
}

// Para sabor
export interface CreateFlavorWithIngredientsDto {
  flavor: {
    flavor: string;
    menuflav_id: number;
    company_id: string;
  };
  ingredients: {
    item_id: number;
    quantity: number;
    measure_id: number;
    presentation_id: number;
  }[];
}
