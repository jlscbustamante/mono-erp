import { useQuery } from '@tanstack/react-query'

import { getPublicParamaters } from '@/data/hex/parameter'

export const useParametersQuery = () => {
  const query = useQuery({
    queryKey: ['parameters-global'],
    queryFn: getPublicParamaters,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  return query
}
