import { NOTIFICATION } from '@/const/notification'
import { Drawer } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Filters } from '../Filters'
import { InvRecipe, InvRecipeFilter } from '../shared-types'
import { filterIFilterInvRecipe, filterInvRecipeSt } from '../state/recipe'
import { transformFilterToValidRecipe } from '../utils'
import { RequestsFilters } from './FilterControl'
import { ListaProductoFinal } from './ListaProductoFinal'
import { UpdateForm } from './UpdateForm'
export const ProductoFinal = () => {
  //invRecipe es lo que se mostrara en la tabla de esta pagina Recetas de producto final
  //const [invRecipe, setInvRecipe] = useState<InvRecipe[]>([])
  //const [userFilters, setUserFilters] = useState<Filters<InvRecipe>>({})
  const setApprovedRequests = useSetRecoilState(filterIFilterInvRecipe)
  const [userFilters, setUserFilters] = useRecoilState(filterInvRecipeSt)
  //datos para el drawer y el form para editar
  const [selectedRequest, setSelectedRequest] = useState<null | InvRecipe>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)

  const applyFilters = async () => {
    try {
      const filters: Filters<InvRecipe> = {}
      const validFilterUsers = transformFilterToValidRecipe(userFilters)
      console.log('validFilters')
      console.log(validFilterUsers)
      console.log('category_id')
      console.log(validFilterUsers.category_id[1])
      console.log(validFilterUsers['category_id'][1])

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
          i.category_id == validFilterUsers.category_id[1],
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
      const filters: Filters<InvRecipe> = {}

      //filters.status = [OpFilter.In, CategoryStatus.Active]

      setUserFilters({})
      //const data = await sdk.filterCategory({ ...filters })
      const response = await fetch('/inv_recipe.json')
      const data = await response.json()

      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  //const handleEditClick = (record: InvRecipe) => {}

  const handleAddClick = () => {
    setIsDrawerVisible(true)
  }

  const handleDrawerClose = () => {
    setSelectedRequest(null)
    setIsDrawerVisible(false)
  }
  const handleDrawerCloseUpdate = () => {
    setSelectedRequest(null)
    setIsUpdateFormVisible(false)
  }
  const handleEditClick = (record: InvRecipe) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
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

    fetchData()
  }, [])

  return (
    <>
      <div className="flex">
        <span className="p-5">Recetas de producto final</span>
        <span>&nbsp;</span>
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
        />
      </div>
      <ListaProductoFinal pHandleEditClick={handleEditClick} />
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
    </>
  )
}
