export interface MockIngrediente {
  name: string
  codigo: string
  cat: string
  measure_id: number
}

//campos de tabla inv_product de BD de produccion

//campos de tabla inv_product de BD de desarrollo
export interface IngredienteDev {
  id: number
  company_id: string
  product: string
  flavor_id: number
  size_id: number
  menuprod_id: number
  status: number
}

export interface IngredienteProd {
  id: number
  product: string
  category_id: number
  measure_id: number
  unit_price: number
  status: number
}

export interface InsumoItem {
  id: number
  company_id: number
  product: string
  product_id: number
  flavor_id: number
  size_id: number
  status: number
}

//para ser usado en la tabla de ingredientes de receta
export interface IItem {
  code: number
  name: string
  collection: string
  quantity: number
  measure_id: number
}
//para ser usado en la tabla de ingredientes de receta
//solo para obtener la abreviatura
export interface UMed {
  id: number
  nombre: string
  abr: string
}
