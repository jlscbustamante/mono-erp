import { useQuery } from '@tanstack/react-query'
import { getBaseRecipes } from '../services/recipeFinalService'


export const useBaseRecipesQuery = () =>
  useQuery({
    queryKey: ['base-recipes'],
    queryFn: getBaseRecipes
  })
