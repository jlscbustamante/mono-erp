import { ICommercialProduct, ICommercialFlavor, ICommercialSize } from '../types/catalog'

export interface ISyncCombination {
  product_id: number
  product_name: string
  flavor_id: number
  flavor_name: string
  size_id: number
  size_name: string
}

export function useCommercialSyncCombinations(
  products: ICommercialProduct[] = [],
  flavors: ICommercialFlavor[] = [],
  sizes: ICommercialSize[] = []
): ISyncCombination[] {
  const combinations: ISyncCombination[] = []

  products.forEach(product => {
    product.flavor_id?.forEach(flavorRef => {
      const flavor = flavors.find(f => f.id === flavorRef.id)
      product.size_id?.forEach(sizeRef => {
        const size = sizes.find(s => s.id === sizeRef.id)
        if (flavor && size) {
          combinations.push({
            product_id: product.id,
            product_name: product.product,
            flavor_id: flavor.id,
            flavor_name: flavor.flavor,
            size_id: size.id,
            size_name: size.size,
          })
        }
      })
    })
  })

  return combinations
}
