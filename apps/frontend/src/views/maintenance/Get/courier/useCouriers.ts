import { useQuery } from '@tanstack/react-query'

import { getCouriers } from './api'

export const useCouriers = (ciaId: string | null) => {
  const query = useQuery({
    queryKey: ['courier-apis', ciaId],
    enabled: !!ciaId,
    queryFn: () => {
      return getCouriers(ciaId!)
    },
    staleTime: Infinity,
  })

  return query
}
