import { useQuery } from '@tanstack/react-query'
import { getCommercialCatalog } from '../services/catalogSalesApi'

export const useCatalogSyncQuery = () => {
  return useQuery({
    queryKey: ['catalog-commercial'],
    queryFn: getCommercialCatalog,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}
