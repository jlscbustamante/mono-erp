import { useQuery } from '@tanstack/react-query'

import { getActiveDrivers } from '@/data/hex/inventory'

export const useDrivers = () => {
  const query = useQuery({
    queryKey: ['drivers-inventory-active'],
    queryFn: getActiveDrivers,
  })

  return query
}
