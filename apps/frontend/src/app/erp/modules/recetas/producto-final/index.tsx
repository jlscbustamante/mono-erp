import { FilterAddButton, UserFilters } from '@/components'
import { NOTIFICATION } from '@/const/notification'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import {
  mapKeyFilterInvRecipe,
  validInvRecipe,
} from '../constants/mapKeyFiltertype'
import { Filters } from '../Filters'
import { DetalleInsumo } from '../nueva-receta/DetalleInsumo'
import { InsumoItem, InvRecipe, InvRecipeFilter } from '../shared-types'
import { filterIFilterInvRecipe } from '../state/recipe'
import { transformFilterToValidRecipe } from '../utils'
import { ListaProductoFinal } from './ListaProductoFinal'
export const ProductoFinal = () => {
  //invRecipe es lo que se mostrara en la tabla de esta pagina Recetas de producto final
  //const [invRecipe, setInvRecipe] = useState<InvRecipe[]>([])
  //1
  const [aUserFilters, aSetUserFilters] = useState<Filters<InvRecipe>>({})
  const setApprovedRequests = useSetRecoilState(filterIFilterInvRecipe)
  //2const [userFilters, setUserFilters] = useRecoilState(filterInvRecipeSt)
  //datos para el drawer y el form para editar
  //const [selectedRequest, setSelectedRequest] = useState<null | InvRecipe>(null)
  //const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  //const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [ingredienteMMostrado, setIngredienteMMostrado] = useState<
    InsumoItem[]
  >([])
  //los items que forman parte de un ingredienteM con receta o coleccion
  const [ingredientesMItems, setIngredientesMItems] = useState<InsumoItem[]>([])

  const applyFilters = async () => {
    try {
      const validFilterUsers = transformFilterToValidRecipe(aUserFilters)
      console.log('validFilters')
      console.log(validFilterUsers)
      console.log('category_id')

      /*const data = await sdk.filterCategory({
        ...filters,
        ...validFilterUsers,
      })
      setApprovedRequests(data)*/
      const response = await fetch('/inv_recipe.json')
      const jsonData = await response.json()
      const respFiltrada = jsonData.filter(
        (i: InvRecipeFilter) =>
          //i.category_id = validFilterUsers['category_id']?.[0]
          i.category_id == validFilterUsers?.category_id?.[1],
      )
      setApprovedRequests(respFiltrada)
      //setInvRecipe(respFiltrada)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  //const cleanFilters = () => {}
  const cleanFilters = async () => {
    try {
      //filters.status = [OpFilter.In, CategoryStatus.Active]

      aSetUserFilters({})
      //const data = await sdk.filterCategory({ ...filters })
      const response = await fetch('/inv_recipe.json')
      const data = await response.json()

      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  //const handleEditClick = (record: InvRecipe) => {}

  const handleDrawerCloseUpdate = () => {
    //setSelectedRequest(null)
    setDrawerOpen(false)
    setIngredienteMMostrado([])
    //setIsUpdateFormVisible(false)
  }
  //const handleEditClick = (record: InvRecipe) => {
  const handleEditClick = (id: number) => {
    console.log('insumo id')
    console.log(id)
    //setIngredienteMMostrado(record)
    //setDrawerOpen(true)

    const estaIngredienteM = ingredientesMItems.filter(
      (i: InsumoItem) => i.product_id == id,
    )
    console.log('ID item encontrado :' + id)
    //console.table(estaIngredienteM)
    console.log('drawerOpen:' + drawerOpen)
    if (estaIngredienteM.length >= 1) {
      setIngredienteMMostrado(estaIngredienteM)
      setDrawerOpen(true)
    }
  }

  useEffect(() => {
    console.log('componente renderizado')
    const fetchData = async () => {
      try {
        const response = await fetch('/inv_recipe.json')
        const jsonData = await response.json()
        setApprovedRequests(jsonData) // Almacenamos los datos en el estado
        //setLoading(false) // Desactivamos el estado de carga
      } catch (err) {
        //setError('Error al cargar datos') // Capturamos cualquier error
        //setLoading(false) // Desactivamos el estado de carga en caso de error
      }
    }

    const fetchDataItems = async () => {
      try {
        const response = await fetch('/inv_menu_items.json')
        const jsonData = await response.json()
        setIngredientesMItems(jsonData) // Almacenamos los datos en el estado
        //setLoading(false) // Desactivamos el estado de carga
      } catch (err) {
        //setError('Error al cargar datos') // Capturamos cualquier error
        //setLoading(false) // Desactivamos el estado de carga en caso de error
      }
    }

    fetchData()
    fetchDataItems()
  }, [])

  return (
    <>
      <div className="flex">
        <span className="p-5">Recetas de producto final</span>
        <span>&nbsp;</span>
        <div className="flex items-center gap-1.5 justify-end my-6">
          <div className="flex flex-1 gap-1">
            <FilterAddButton
              userFilters={aUserFilters}
              setUserFilters={aSetUserFilters}
              items={validInvRecipe()}
              getFilterTypesForKey={mapKeyFilterInvRecipe}
            />
            <UserFilters
              userFilters={aUserFilters}
              setFilters={aSetUserFilters}
              items={validInvRecipe()}
              getFilterTypesForKey={mapKeyFilterInvRecipe}
              selections={{
                status: [
                  { label: 'Activo', value: 'A' },
                  { label: 'Inactivo', value: 'E' },
                ],
                company_id: [
                  {
                    label: 'Pizza Raúl',
                    value: 'P',
                  },
                  {
                    label: 'Steak house',
                    value: 'S',
                  },
                ],
                type_mov: [
                  {
                    label: 'Venta',
                    value: 'V',
                  },
                  { label: 'Gasto', value: 'G' },
                ],
              }}
            />
          </div>
          <Button
            type="primary"
            shape="circle"
            icon={<FiSearch />}
            onClick={applyFilters}
            className="flex items-center justify-center"
          />
          <Button
            type="primary"
            color="danger"
            shape="circle"
            icon={<MdOutlineCleaningServices />}
            onClick={cleanFilters}
            danger
          />
        </div>
      </div>
      <ListaProductoFinal pHandleEditClick={handleEditClick} />
      <DetalleInsumo
        data={ingredienteMMostrado}
        drawerOpen={drawerOpen}
        drawerClose={handleDrawerCloseUpdate}
        oper={3}
      />
      {/*
      <Drawer
        title={`Editar categoria`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            category={selectedRequest}
            setCategory={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
       comentario */}
    </>
  )
}
