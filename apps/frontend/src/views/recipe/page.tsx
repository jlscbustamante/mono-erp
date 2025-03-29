import { useMemo, useReducer, useState } from "react";
import { useSupplierQuery } from "../products/provider/useSupplierQuery";
import { useRecipe } from "./useRecipe";
import { useRecipeQuery } from "./useRecipeQuery";


export default function Provider(){
    const [openModal, setOpenModal] = useState(false)
    const [controlerApply, applyFilters] = useReducer((state) => state + 1, 0)
    const {filterName, setFilterName, filters, setFilters} = useRecipe()

    const query = useRecipeQuery()

    const dataFiltered = useMemo(() => {
        let initialData = query.data ?? []
        if(filterName != ''){
            initialData = initialData.filter((item)=>{
                return item.
            })
        }
    })
}

