import { Filters3 } from "@/data/types/Filters";
import { useReducer, useState } from "react";
import { atom, RecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import * as sdk from '@/data/Recipe/sdk'
import { toast } from "react-toastify";
import { NOTIFICATION } from "@/const/notification";
import { IFinalRecipePayload } from "../../shared/types";




export const filtersRecipetAtom : RecoilState<Filters3<IFinalRecipePayload>> = atom({
    key: 'filtersRecipe',
    default: {},
})

export const useRecipe = () => {
    const [finalRecipes, setFinalRecipes] = useState<IFinalRecipePayload[]>([])
    const [filterName, setFilterName] = useState("")
    const [, onReload] = useReducer((state) => state + 1, 0)
    const [, setControler] = useReducer((state) => state + 1, 0)
    const [loading, setLoading] = useState(false)
    const filters = useRecoilValue(filtersRecipetAtom)
    const setFilters = useSetRecoilState(filtersRecipetAtom)

    const cleanAll = () => {
        setFilterName('')
        setFilters({})
    }

    const loadFinalRecipes = async () => {
        try{
            setLoading(true)
            const response : IFinalRecipe[] = await sdk.getFinalRecipes()
            setFinalRecipes(response)  
        }catch(err: any){
            toast.error(err.message, NOTIFICATION.error)            
        }finally{
            setLoading(false)
        }
    }

    return{
        finalRecipes,
        cleanAll,
        setControler,
        filterName,
        setFilterName,
        onReload,
        filters,
        setFilters,
        loading,
        loadFinalRecipes
    }
}
