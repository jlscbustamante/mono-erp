import { useQuery } from '@tanstack/react-query'

import * as sdk from '@/data/products/sdk'

export const useItems = () => {
  const query = useQuery({
    queryKey: ['items-inventory'],
    queryFn: async () => {
      return await sdk.productItems({
        filters: {},
        relations: {
          product: {
            measure: true,
          },
          presentation: true,
        },
      })
    },
  })

  return query
}
