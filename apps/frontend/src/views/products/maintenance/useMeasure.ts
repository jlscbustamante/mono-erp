import { useQuery } from '@tanstack/react-query'

import { getMeasures } from '@/data/products/sdk/maintenance'

export const useMeasure = () => {
  const query = useQuery({
    queryKey: ['measure-inventory'],
    queryFn: getMeasures,
  })
  return query
}
