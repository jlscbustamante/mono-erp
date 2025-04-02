import { useRecoilState } from "recoil";

import { filtersSupplierAtom } from "../products/provider/useSupplier";
import { Button, Input } from "antd";
import { AddFilterButton } from "@/components/filter/AddFilterButton";
import { OpFilter } from "@/data/types/Filters";
import { ShowFilters } from "@/components/filter/ShowFilters";
import { FiSearch } from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";

const items = [
    {
        label: 'Id',
        key: 'id',
        options: [OpFilter.Equal],
    },
    {
        label: 'Dato 2',
        key: 'dato2',
        options: [OpFilter.Contain],
    },
    {
        label: 'Estado',
        key: 'status',
        options: [OpFilter.Select],
        selection: [
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 },
        ],
    },
]

export const ControlRecipe = ({
    openModal,
    filters,
    reload,
  }: {
    openModal: () => void
    filters: {
      filterName: string
      setFilterName: (filterName: string) => void
    }
    reload: (clean?: boolean) => void
})=>{

    const [filters2, setFilters2] = useRecoilState(filtersSupplierAtom)
    
    return (
        <div className="flex justify-between">
            <div className="flex gap-1">
                <Input 
                    className="w-80"
                    placeholder="Buscar por nombre de receta"
                    addonBefore="Receta"
                    value={filters.filterName}
                    onChange={(e)=> filters.setFilterName(e.target.value)}
                    onPressEnter={()=>{
                        reload()
                    }}
                />

                <AddFilterButton 
                    items={items}
                    userFilters={filters2}
                    setUserFilters={setFilters2}
                />

                <ShowFilters
                    rootClass="flex gap-1"
                    options={items}
                    userFilters={filters2}
                    setUserFilters={setFilters2}
                />
                <Button 
                    type="primary"
                    shape="circle"
                    icon={<FiSearch />}
                    onClick={() => reload()}
                    className="flex items-center justify-center"
                />
                <Button 
                    type="primary"
                    color="danger"
                    shape="circle"
                    icon={<MdOutlineCleaningServices />}
                    onClick={()=>{
                        reload(true)
                    }}
                    danger
                />

            </div>
            <Button className="flex items-center" type="primary" onClick={openModal}>
                Nuevo
            </Button>
        </div>
    )
}