import { RecipeStatus } from "../status/status";

type MeasurementUnit = "kg" | "unit" | "1";

export interface IItem  {
    name: string
    quantity: number
    unit: MeasurementUnit
}

export interface IBaseRecipe {
    id: number
    dishType: string
    ingredients: IItem[]
    status: RecipeStatus
    created_at: string
}

export interface IFlavorRecipe {
    id: number
    name: string
    ingredients: IItem[]
    status: RecipeStatus
    created_at: string
}

export interface ISupplies extends IItem{
}

export interface IFinalRecipe {
    id: number
    baseRecipe: IBaseRecipe
    flavorRecipe: IFlavorRecipe
    supplies : ISupplies[]
    status: RecipeStatus
    created_at: string
}


export interface IFilterRecipe {
  id?: number
  baseRecipe?: IBaseRecipe
  flavorRecipe?: IFlavorRecipe 
  supplies?: IItem[]
  status?: RecipeStatus
  created_at: string
}

export interface ICreateRecipe extends Omit<IFinalRecipe, 'id'> {
  id: any
}