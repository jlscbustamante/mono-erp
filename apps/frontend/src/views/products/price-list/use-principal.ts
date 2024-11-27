import { getPrincipalProducts } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const usePrincipalItems = () => {
  const query = useQuery({
    queryKey: ['items-principal'],
    queryFn: getPrincipalProducts,
  })

  return query
}
