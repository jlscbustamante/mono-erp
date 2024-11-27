import { getLegalWarehouses } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const useLegalWarehouses = () => {
  const query = useQuery({
    queryKey: ['warehouses-inventory'],
    queryFn: getLegalWarehouses,
  })

  return query
}
