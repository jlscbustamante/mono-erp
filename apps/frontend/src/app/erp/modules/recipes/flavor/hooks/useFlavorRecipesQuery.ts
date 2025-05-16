import { IRecipeFlavor } from "@/views/recipes/shared/types"
import { useQuery } from "@tanstack/react-query"
import { getFlavorsByBaseId } from "@/data/Recipe/sdk"

export const useFlavorRecipesQuery = (baseId?: number) => {
  return useQuery<IRecipeFlavor[]>({
    queryKey: ["flavor-recipes", baseId],
    queryFn: async () => {
      if (baseId === undefined) throw new Error("baseId is undefined");
      return getFlavorsByBaseId(baseId);
    },
    enabled: !!baseId,
    staleTime: Infinity,
  });
}