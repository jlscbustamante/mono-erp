import { useQuery } from '@tanstack/react-query'

import { getDispatchDetail } from '@/data/hex/inventory'

export const useDispatchDetail = (dispatchId: number | null) => {
  const query = useQuery({
    queryKey: ['dispatch-detail', dispatchId],
    enabled: !!dispatchId,
    queryFn: () => getDispatchDetail(dispatchId!),
  })

  return query
}
