import axios from 'axios'
import { ICommercialCatalogResponse, ICommercialProduct } from '../types/catalog'
import { IProduct, IProductFlavor, IProductSize } from '../../shared/types'
import { baseUrl } from '@/data/api/baseUrl'
import config from '@/config'


export const getCommercialCatalog = async (): Promise<ICommercialCatalogResponse> => {
  console.log('getCommercialCatalog')
  const { data } = await axios.get(
    `${config.apiCentral}/api/backoffice/productsMaintenance/dataForErp`
  )
  return data
}

// Consulta productos ya registrados en la BD
export const getProductsFromDB = async (): Promise<IProduct[]> => {

    return baseUrl<IProduct[]>('api/view/recipe/catalog-sales/products', {
        method: 'GET',
        useV2: true,
    })
}

export const getSizesFromDB = async (): Promise<IProductSize[]> => {
    return baseUrl<IProductSize[]>('api/view/recipe/catalog-sales/sizes', {
        method: 'GET',
        useV2: true,
    })
}


export const getFlavorsFromDB = async (): Promise<IProductFlavor[]> => {
    return baseUrl<IProductFlavor[]>('api/view/recipe/catalog-sales/flavors', {
        method: 'GET',
        useV2: true,
    })
}

export const syncProduct = async (product: IProduct): Promise<IProduct> => {
    const payload: IProduct = {
        product: product.product,
        menuprod_id: product.menuprod_id,
        company_id: product.company_id
    }

    return baseUrl<IProduct>('api/view/recipe/catalog-sales/products/add', {
        method: 'POST',
        body: payload,
        useV2: true,
    })
}

export const syncFlavor = async(flavor: IProductFlavor): Promise<IProductFlavor> => {
    const payload: IProductFlavor = {
        flavor: flavor.flavor,
        menuflav_id: flavor.menuflav_id,
        company_id: flavor.company_id
    }

    return baseUrl<IProductFlavor>('api/view/recipe/catalog-sales/flavors/add', {
        method: 'POST',
        body: payload,
        useV2: true,
    })
}

export const syncSize = async(size: IProductSize): Promise<IProductSize> => {
    const payload: IProductSize = {
        size: size.size,
        menusize_id: size.menusize_id,
        company_id: size.company_id
    }

    return baseUrl<IProductSize>('api/view/recipe/catalog-sales/sizes/add', {
        method: 'POST',
        body: payload,
        useV2: true,
    })
}

export const syncManyProducts = async(product:IProduct[]) => {

    return baseUrl<IProduct[]>('api/view/recipe/catalog-sales/products/add-many', {
        method: 'POST',
        body: product,
        useV2: true,
    })
}

export const syncManyFlavors = async(flavor:IProductFlavor[]) => {
    return baseUrl<IProductFlavor[]>('api/view/recipe/catalog-sales/flavors/add-many', {
        method: 'POST',
        body: flavor,
        useV2: true,
    })
}

export const syncManySizes = async(size:IProductSize[]) => {
    return baseUrl<IProductSize[]>('api/view/recipe/catalog-sales/sizes/add-many', {
        method: 'POST',
        body: size,
        useV2: true,
    })
}