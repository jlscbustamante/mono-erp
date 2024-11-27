import { drivers } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const useDrivers = () => {
  const query = useQuery({
    queryKey: ['drivers-inventory'],
    queryFn: drivers,
  })

  return query
}
