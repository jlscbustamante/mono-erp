export interface ICommercialProduct {
  id: number
  company_id: string
  product: string
  menuprod_id: number
  status: number
  flavor_id: FlavorId[]
  size_id: SizeId[]
  category_id: number
  category: string
}

export interface ICommercialSize {
  id: number
  company_id: string
  size: string
  menusize_id: number
}

export interface SizeId {
  id: number
}

export interface FlavorId {
  id: number
}

export interface ICommercialFlavor {
  id: number
  company_id: string
  flavor: string
}

export interface ICommercialCatalogResponse {
  products: ICommercialProduct[]
  sizes: ICommercialSize[]
  flavors: ICommercialFlavor[]
}
