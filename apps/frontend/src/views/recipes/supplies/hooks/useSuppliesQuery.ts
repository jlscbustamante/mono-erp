import { getAllSupplies } from "@/data/Recipe/sdk"
import { useQuery } from "@tanstack/react-query"


export const useSuppliesQuery = () => {
  return useQuery({
    queryKey: ['supplies'],
    queryFn: getAllSupplies,
    staleTime: Infinity,
    //staleTime: 5 * 60 * 1000,
  })
}