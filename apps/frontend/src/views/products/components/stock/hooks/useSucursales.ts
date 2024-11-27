import { useQuery } from '@tanstack/react-query'

import { getWarehouses } from '@/data/hex/inventory'

export const useSucursales = () => {
  const query = useQuery({
    queryKey: ['sucursales-stock'],
    queryFn: () => getWarehouses(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  return query
}
