import { getFlavorsByBaseId } from "@/data/Recipe/sdk"
import { useQuery } from "@tanstack/react-query"

export const useFlavorRecipesQuery = (baseId?: number) => {
  return useQuery({
    queryKey: ["flavor-recipes", baseId],
    queryFn: async () => {
      if (baseId === undefined) throw new Error("baseId is undefined");
      return getFlavorsByBaseId(baseId);
    },
    enabled: !!baseId,
    staleTime: Infinity,
    //staleTime: 5 * 60 * 1000,
  });
};