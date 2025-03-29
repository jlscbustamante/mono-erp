import { useQuery } from "@tanstack/react-query"

import * as sdk from '@/data/Recipe/sdk'

export const useRecipeQuery = () =>{
    const query = useQuery({
        queryKey: ['recipe-inventory'],
        queryFn: sdk.getFinalRecipes,
        staleTime: Infinity
    })
    return query
}

