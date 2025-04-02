import { useQuery } from '@tanstack/react-query'
import { getAllBaseRecipes } from '../services/recipeBaseApi'

export const useBaseRecipesQuery = () => {
  return useQuery({
    queryKey: ['base-recipes'],
    queryFn: getAllBaseRecipes,
    staleTime: Infinity,
    //staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
