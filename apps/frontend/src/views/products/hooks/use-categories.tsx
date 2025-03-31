import { categories } from '@/data/products/sdk'
import { useQuery } from '@tanstack/react-query'

export const useCategories = () => {
  const query = useQuery({
    queryKey: ['items-cats'],
    queryFn: () => categories(),
  })

  return query
}
