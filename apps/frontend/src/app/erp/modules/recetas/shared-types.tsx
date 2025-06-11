//campos existentes en la BD

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

//inv_recollection_mix
export interface invRecollectionMix {
  id: number
  recollection_id: number
  item_id: number
  quantity: number
  presentation_id: number
  measure_id: number
}

export interface InvRecipe {
  id: number
  company_id: number
  recipe: string
  menu_item_id: number
  save_tag: string
  status: number
}

export interface InvRecipeFilter {
  id: number
  company_id: number
  recipe?: string
  menu_item_id: number
  save_tag: string
  status?: number
}
export interface InvRecipeMix {
  id: number
  recipe_id: number
  recipe_group: string
  recipe_base: number
  item_id: number
  quantity: number
  presentation_id: number
  measure_idstatus: number
}

//tabla inv_recollection
export interface InvRecollection {
  id: number
  company_id: number
  collection: string
  based_on: string
  is_base: number
  factor: number
  status: number
}

//tabla inv_menu_items
//es la variante del catalog de productos de venta : inv_menu_product
//es decir tambien son productos de venta
//Items es lo que esta en el inventario : almacen
//pero en esta tabla no esta asociado con la tabla inv_items
export interface InvMenuItems {
  id: number
  company_id: number
  product: string
  product_id: number
  size_id: number
  flavor_id: number
  status: number
}

//tabla inv_productitem
export interface inv_productitem {
  id: number
  product_id: number
  item_id: number
}

//tabla inv_menu_product
export interface InvMenuProduct {
  id: number
  company_id: number
  product: string
  recipe_req: number
  status: number
}
//tabla inv_menu_size
export interface InvMenuSize {
  id: number
  company_id: number
  size: number
  status: number
}

//tabla inv_menu_flavor
export interface InvMenuFlavor {
  id: number
  company_id: number
  flavor: string
  status: number
}

//tabla inv_item
export interface InvItem {
  id: number
  item_code: string
  item_type: string
  item_name: string
  category_id: number
  subcategory_id: number
  supplier_id: number
  brand_id: number
  presentation_id: number
  item_used_to: string
  measure_id: number
  unit_cost: number
  unit_price: number
  status: number
  old_product_id: number
}

//fin de tablas de BD
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
