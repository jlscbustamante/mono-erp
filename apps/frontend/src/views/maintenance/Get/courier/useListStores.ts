import { useQuery } from '@tanstack/react-query'

import { useParametersQuery } from '@/hooks/useParamters'

import { getListStores } from './api'

export const useListStores = () => {
  const { data } = useParametersQuery()
  const query = useQuery({
    queryKey: ['listStores-courier', data?.ciaIdMoturider],
    enabled: data && !!data?.ciaIdMoturider,
    queryFn: () => getListStores(data!.ciaIdMoturider!),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return { data: query?.data ?? [] }
}
