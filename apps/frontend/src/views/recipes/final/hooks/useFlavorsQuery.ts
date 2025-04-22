import { useQuery } from '@tanstack/react-query'
import { getFlavors } from '../services/recipeFinalService'


export const useFlavorsQuery = () =>
  useQuery({
    queryKey: ['flavors'],
    queryFn: getFlavors
  })
