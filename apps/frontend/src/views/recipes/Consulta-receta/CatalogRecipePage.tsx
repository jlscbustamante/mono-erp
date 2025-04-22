import { useMemo, useReducer, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Modal, Tag, Table } from "antd";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IFinalRecipeSummary } from "../shared/types";
import { EditRecipeDrawer, useRecipeDrawer } from "./components/EditRecipeDrawer";
import { ControlRecipe } from "../ControlRecipe";
import { useRecipeQuery } from "./hooks/useRecipeQuery";
import { useRecipe } from "./hooks/useRecipe";



export default function CatalogRecipePage(){
    const [, setOpenModal] = useState(false)
    const [controlerApply, applyFilters] = useReducer((state) => state + 1, 0)
    const {filterName, setFilterName, filters, setFilters} = useRecipe()

    const query = useRecipeQuery()
    console.log(query);
    

    const dataFiltered = useMemo(() => {
        let initialData = query.data ?? []
        // if(filterName != ''){
        //     initialData = initialData.filter((item)=>{
        //         return item..toLowerCase().includes(filterName.toLowerCase())
        //     })
        // }

        if(filters.product_id){
            const idEqual: number | undefined = (filters as any)?.id?.[1]
            if(idEqual){
                initialData = initialData.filter((item)=> item.id == idEqual)
            }
        }

        // if(filters.status){
        //     const status: number | undefined = (filters as any)?.status?.[1]
        //     if(status != undefined){
        //         initialData = initialData.filter((item)=> item.status == status)
        //     }
        // }

        console.log(initialData);
        
        return initialData;
    }, [query.data, controlerApply])

    return(
        <div className="p-3 flex flex-col gap-3">
            <ControlRecipe
                openModal={() => setOpenModal(true)}
                filters={{ filterName, setFilterName }}
                reload={(clean) => {
                    if (clean) {
                        setFilterName('')
                        setFilters({})
                        applyFilters()
                    }
                    applyFilters()
                }}
            />
            <TableRecipe
                recipes={dataFiltered}
                loading={query.isLoading}
                onReload={()=> query.refetch()}
            />
            <EditRecipeDrawer
                onUpdate={()=>{
                    query.refetch()
                }}
            />
        </div>
    )
}

const TableRecipe = ({
    recipes,
    loading,
    onReload
}:{
    recipes: IFinalRecipeSummary[]
    loading: boolean
    onReload: () => void
}) => {
    const {onOpen} = useRecipeDrawer()
    const columnsTable: ColumnsType<IFinalRecipeSummary> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'state',
            render: (status: number) => {
                if (status == 1) {
                return <Tag color="green">Activo</Tag>
                } else if (status == 0) {
                return <Tag color="red">Inactivo</Tag>
                }
            },
        },
        {
            title:'',
            width: 50,
            render: (record: IFinalRecipeSummary) => {
                return(
                    <div className="flex items-center justify-between gap-2">
                        <div
                            className="bg-blue-500 text-white p-1 rounded"
                            onClick={() => {
                                onOpen(record)
                            }}
                        >
                            <MdEdit className="h-auto w-5" />
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Eliminar receta',
                                    content: '¿Está seguro de eliminar esta receta?',
                                    onOk: () => {
                                        // Eliminar receta
                                        /*deleteSupplier(record.id)
                                            .then((message) => {
                                                toast.success(message.message)
                                                onReload()
                                            })
                                            .catch((err) => {
                                                toast.error(err)
                                            })*/
                                        onReload()
                                    },
                                })
                            }}
                        >
                            <FaTrash className="h-auto w-4" />
                        </div>
                    </div>
                )
            }
        }
    ]

    return (
        <Table
            size="small"
            rowKey={'id'}
            columns={columnsTable}
            dataSource={recipes}
            loading={loading}
            pagination={false}
        />
    )
}