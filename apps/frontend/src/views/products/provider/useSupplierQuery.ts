import { useQuery } from '@tanstack/react-query'

import * as sdk from '@/data/products/sdk'

export const useSupplierQuery = () => {
  const query = useQuery({
    queryKey: ['supplier-inventory'],
    queryFn: sdk.suppliers,
    staleTime: Infinity,
  })
  return query
}
