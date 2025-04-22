import { useQuery } from '@tanstack/react-query'
import { getSizes } from '../services/recipeFinalService'


export const useSizesQuery = () =>
  useQuery({
    queryKey: ['sizes'],
    queryFn: getSizes
  })
