import { useQuery } from '@tanstack/react-query'

import { getPresentation } from '@/data/products/sdk/maintenance'

export const usePresentation = () => {
  const query = useQuery({
    queryKey: ['presentations-inventory'],
    queryFn: getPresentation,
  })
  return query
}
