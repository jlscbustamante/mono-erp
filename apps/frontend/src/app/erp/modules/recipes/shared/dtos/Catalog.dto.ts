import { IProduct } from '../types'

export interface CreateProductDto {
  id?: number // ✅ añadimos esto
  product: string
  company_id: string
  menuprod_id: number
  flavor_id: number
  size_id: number
}

export interface UpdateProductDto extends IProduct {}

export interface CreateProductSizeDto {
  company_id: string
  size: string
  menusize_id: number
}

export interface CreateProductFlavorDto {
  company_id: string
  flavor: string
  menuflav_id: number
}

export interface SyncProductWithSizesAndFlavorsDto {
  product: CreateProductDto
  flavors?: CreateProductFlavorDto[]
  sizes?: CreateProductSizeDto[]
}

export interface ProductSyncedDto extends IProduct {
  flavor: string // obtenido desde inv_product_flavor
  size: string // obtenido desde inv_product_size
  company_title: string // obtenido desde adm_company
  category_id: number // útil para filtro por categoría
}

export interface SyncResponseDto {
  insertedProducts: number[]
  insertedSizes: number[]
  insertedFlavors: number[]
}
