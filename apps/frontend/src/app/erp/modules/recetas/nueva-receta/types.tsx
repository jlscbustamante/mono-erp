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

/**
 * 
 * INSERT INTO `db_erpraul_v1`.`inv_recipe`
(`id`,
`company_id`,
`recipe`,
`menu_item_id`,
`save_tag`,
`status`,
`created_at`,
`updated_at`)
VALUES
(<{id: }>,
<{company_id: }>,
<{recipe: }>,
<{menu_item_id: }>,
<{save_tag: }>,
<{status: 1}>,
<{created_at: CURRENT_TIMESTAMP}>,
<{updated_at: CURRENT_TIMESTAMP}>);

 */

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
