import { ICommercialCatalogResponse } from '../types/catalog'
import { IProductFlavor, IProductSize } from '../../shared/types'
import { baseUrl } from '@/data/api/baseUrl'
//import config from '@/config'
import {
  CreateProductDto,
  CreateProductFlavorDto,
  CreateProductSizeDto,
  ProductSyncedDto,
  SyncProductWithSizesAndFlavorsDto,
  SyncResponseDto,
} from '../../shared/dtos/Catalog.dto'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const getCommercialCatalog =
  async (): Promise<ICommercialCatalogResponse> => {
    // const { data } = await axios.get(
    //   `${config.apiCentral}/api/backoffice/productsMaintenance/dataForErp`,
    // )
    // return data

    return {
      products: [
        {
          "id": 1245,
          "company_id": "STEAKHOUSE",
          "product": "PORTON MOSTO VERDE ACHOLADO",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 100 }
          ],
          "category_id": 36,
          "category": "PISCOS",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1246,
          "company_id": "STEAKHOUSE",
          "product": "PORTON MOSTO VERDE QUEBRANTA",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 101 }
          ],
          "category_id": 36,
          "category": "PISCOS",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1307,
          "company_id": "STEAKHOUSE",
          "product": "POSTRE CUMPLEAÑERO",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 102 }
          ],
          "category_id": 24,
          "category": "POSTRES",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1308,
          "company_id": "STEAKHOUSE",
          "product": "POSTRE DE CORTESIA",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 103 }
          ],
          "category_id": 24,
          "category": "POSTRES",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1515,
          "company_id": "STEAKHOUSE",
          "product": "PRIMAVERA",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 3 },
            { "id": 5 }
          ],
          "category_id": 44,
          "category": "Pizzas pr",
          "size_id": [
            { "id": 35 },
            { "id": 36 },
            { "id": 37 },
            { "id": 38 },
            { "id": 39 },
            { "id": 40 }
          ]
        },
        {
          "id": 1383,
          "company_id": "STEAKHOUSE",
          "product": "SAN LUIS",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 104 }
          ],
          "category_id": 32,
          "category": "BEBIDAS CAV",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1391,
          "company_id": "STEAKHOUSE",
          "product": "TE HELADO",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 105 }
          ],
          "category_id": 32,
          "category": "BEBIDAS CAV",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1433,
          "company_id": "STEAKHOUSE",
          "product": "STELA ARTOIS",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 106 }
          ],
          "category_id": 31,
          "category": "CERVEZAS CAV",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1492,
          "company_id": "STEAKHOUSE",
          "product": "TEQUILA DON JULIO",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 107 }
          ],
          "category_id": 40,
          "category": "ANIS Y TEQUILAS",
          "size_id": [
            { "id": 14 }
          ]
        },
        {
          "id": 1140,
          "company_id": "STEAKHOUSE",
          "product": "TIRAMISÚ",
          "menuprod_id": 1,
          "status": 1,
          "flavor_id": [
            { "id": 108 }
          ],
          "category_id": 24,
          "category": "POSTRES",
          "size_id": [
            { "id": 14 }
          ]
        }
      ],
      sizes: [
        {
          id: 1,
          company_id: 'PIZZARAUL',
          size: 'Familiar (10 porc)',
          menusize_id: 4,
        },
        {
          id: 12,
          company_id: 'PIZZARAUL',
          size: 'Gigante (12 porc - 41 cm)',
          menusize_id: 5,
        },
        {
          id: 9,
          company_id: 'PIZZARAUL',
          size: 'Unico tamaño',
          menusize_id: 9,
        },
        {
          id: 14,
          company_id: 'STEAKHOUSE',
          size: 'Único tamaño',
          menusize_id: 2,
        },
      ],
      flavors: [
        {
          id: 1,
          company_id: 'PIZZARAUL',
          flavor: 'Fullmeat',
        },
        {
          id: 3,
          company_id: 'PIZZARAUL',
          flavor: 'Primavera',
        },
        {
          id: 5,
          company_id: 'PIZZARAUL',
          flavor: 'American Burger',
        },
        {
          id: 8,
          company_id: 'PIZZARAUL',
          flavor: 'Suprema',
        },
        {
          id: 14,
          company_id: 'PIZZARAUL',
          flavor: 'Hawaiana',
        },
        {
          id: 16,
          company_id: 'PIZZARAUL',
          flavor: 'Siciliana',
        },
        {
          id: 100,
          company_id: 'STEAKHOUSE',
          flavor: 'Pisco Acholado',
        },
        {
          id: 101,
          company_id: 'STEAKHOUSE',
          flavor: 'Pisco Quebranta',
        },
        {
          id: 102,
          company_id: 'STEAKHOUSE',
          flavor: 'Torta Cumpleaños',
        },
        {
          id: 103,
          company_id: 'STEAKHOUSE',
          flavor: 'Mini Postre',
        },
      ],
    }
  }

// Consulta productos ya registrados en la BD
export const getProductsFromDB = async (): Promise<ProductSyncedDto[]> => {
  return baseUrl<ProductSyncedDto[]>('api/view/recipe/catalog-sales/products', {
    method: 'GET',
    useV2: true,
  })

  // return [
  //     {
  //       id: 1,
  //       company_id: 'PIZZARAUL',
  //       product: 'Pizza Americana',
  //       menuprod_id: 101,
  //       status: 1,
  //       flavor_id: 15,
  //       size_id: 12,
  //       company_title: 'Pizza Raúl',
  //       flavor: 'Americana',
  //       size: 'Gigante (12 porc - 41 cm)',
  //       category_id: 2
  //     },
  //     {
  //       id: 2,
  //       company_id: 'PIZZARAUL',
  //       product: 'Pizza Carbonara',
  //       menuprod_id: 102,
  //       status: 1,
  //       flavor_id: 7,
  //       size_id: 1,
  //       company_title: 'Pizza Raúl',
  //       flavor: 'Carbonara',
  //       size: 'Familiar (10 porc)',
  //       category_id: 2
  //     }
  //   ]
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

export const syncProduct = async (
  payload: SyncProductWithSizesAndFlavorsDto,
) => {
  // return baseUrl<CreateProductDto>('api/view/recipe/catalog-sales/products/add', {
  //     method: 'POST',
  //     body: payload,
  //     useV2: true,
  // })

  console.log('Sincronizando producto individual', payload)
  await delay(1000)
  return payload.product
}

export const syncFlavor = async (
  flavor: IProductFlavor,
): Promise<IProductFlavor> => {
  // const payload: IProductFlavor = {
  //     flavor: flavor.flavor,
  //     menuflav_id: flavor.menuflav_id,
  //     company_id: flavor.company_id
  // }

  // return baseUrl<IProductFlavor>('api/view/recipe/catalog-sales/flavors/add', {
  //     method: 'POST',
  //     body: payload,
  //     useV2: true,
  // })

  console.log('Sincronizando sabor:', flavor)
  await delay(500)
  return flavor
}

export const syncSize = async (size: IProductSize): Promise<IProductSize> => {
  // const payload: IProductSize = {
  //     size: size.size,
  //     menusize_id: size.menusize_id,
  //     company_id: size.company_id
  // }

  // return baseUrl<IProductSize>('api/view/recipe/catalog-sales/sizes/add', {
  //     method: 'POST',
  //     body: payload,
  //     useV2: true,
  // })

  console.log('Sincronizando tamaño:', size)
  await delay(500)
  return size
}

export const syncManyProductsWithSizes = async (
  products: SyncProductWithSizesAndFlavorsDto[],
): Promise<SyncResponseDto> => {
  // Simulación o llamada real
  return baseUrl<SyncResponseDto>(
    'api/view/recipe/catalog-sales/products/add-many',
    {
      method: 'POST',
      body: products,
      useV2: true,
    },
  )
}

export const syncManyProducts = async (product: CreateProductDto[]) => {
  return baseUrl<CreateProductDto[]>(
    'api/view/recipe/catalog-sales/products/add-many',
    {
      method: 'POST',
      body: product,
      useV2: true,
    },
  )
}

export const syncManyFlavors = async (flavor: CreateProductFlavorDto[]) => {
  return baseUrl<CreateProductSizeDto[]>(
    'api/view/recipe/catalog-sales/flavors/add-many',
    {
      method: 'POST',
      body: flavor,
      useV2: true,
    },
  )
}

export const syncManySizes = async (size: CreateProductSizeDto[]) => {
  return baseUrl<CreateProductSizeDto[]>(
    'api/view/recipe/catalog-sales/sizes/add-many',
    {
      method: 'POST',
      body: size,
      useV2: true,
    },
  )
}
