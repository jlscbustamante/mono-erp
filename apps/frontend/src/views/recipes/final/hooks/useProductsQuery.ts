import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/recipeFinalService.ts'


export const useProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })
