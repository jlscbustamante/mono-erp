import { useQuery } from '@tanstack/react-query'

import { getEquivalances } from '@/data/products/sdk/maintenance'

export const useEquivalence = () => {
  const query = useQuery({
    queryKey: ['equivalence-inventory'],
    queryFn: getEquivalances,
  })
  return query
}
