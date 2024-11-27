import { useQuery } from '@tanstack/react-query'

import { getBrands } from '@/data/products/sdk/maintenance'

export const useBrands = () => {
  const query = useQuery({
    queryKey: ['brands-inventory'],
    queryFn: getBrands,
  })
  return query
}
