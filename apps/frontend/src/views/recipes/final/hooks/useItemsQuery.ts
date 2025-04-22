import { useQuery } from '@tanstack/react-query'
import { getItems } from '../services/recipeFinalService'

export const useItemsQuery = (categoryId?: number) =>
  useQuery({
    queryKey: ['items', categoryId],
    queryFn: () => getItems(categoryId)
  })
