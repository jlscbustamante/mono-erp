import { useQuery } from '@tanstack/react-query'

import { getCategories } from '@/data/products/sdk/maintenance'

export const useCategory = () => {
  const query = useQuery({
    queryKey: ['categories-inventory'],
    queryFn: getCategories,
  })
  return query
}
