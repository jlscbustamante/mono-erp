import { getWarehouseRoute } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const useWarehousesRoute = () => {
  const query = useQuery({
    queryKey: ['warehouses-route'],
    queryFn: getWarehouseRoute,
  })

  return query
}
