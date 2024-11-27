import { useQuery } from '@tanstack/react-query'

import { getItems } from '@/data/hex/inventory'

export const useItems = () => {
  const query = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  })

  return query
}
