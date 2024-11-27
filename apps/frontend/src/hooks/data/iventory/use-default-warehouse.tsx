import { defaultWarehouse } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const useDefaultWarehouse = () => {
  const query = useQuery({
    queryKey: ['default-warehouse'],
    queryFn: defaultWarehouse,
    staleTime: Infinity,
  })

  return query
}
