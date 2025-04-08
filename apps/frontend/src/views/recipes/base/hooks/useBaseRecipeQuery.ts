import { useQuery } from '@tanstack/react-query'
import { baseUrl } from '@/data/api/baseUrl';
import { IRecipeBase } from '../../shared/types';

export const useBaseRecipesBySizeQuery = (sizeId?: number) => {
  return useQuery({
    queryKey: ['base-recipes', sizeId],
    queryFn: async () => {
      if (!sizeId) throw new Error("sizeId no esta definido");
      return baseUrl<IRecipeBase[]>(`/api/view/recipe/base/bySize/${sizeId}`, {
        method: 'GET',
        useV2: true
      });
    },
    enabled: !!sizeId,
    staleTime: Infinity
  });
};