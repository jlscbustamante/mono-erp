import { useQuery } from '@tanstack/react-query'
import { getSupplies } from '../services/recipeFinalService'

export const useSuppliesQuery = () =>
  useQuery({
    queryKey: ['supplies'],
    queryFn: getSupplies
  })
