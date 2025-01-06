import { rhApi } from '@/lib/api/rh'
import { useQuery } from '@tanstack/react-query'
import { RhEmployee } from 'pizzadb'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Filters3 } from 'shared'
import { CreateEmployeeDrawer } from './create-employee-drawer'
import { EditEmployeeDrawer } from './edit-employee-drawer'
import { EmployeesTable } from './employees-table'
import { NavEmployees } from './nav-employees'

interface IEmpleadoContext {
  filters: Filters3<RhEmployee>
  setFilters: Dispatch<SetStateAction<Filters3<RhEmployee>>>
  isLoading: boolean
  data: RhEmployee[]
  setController: Dispatch<SetStateAction<number>>
  refetch: () => void
  store: string
  setStore: Dispatch<SetStateAction<string>>
}

export const EmpleadoContext = createContext<IEmpleadoContext | null>(null)

export const EmpleadoPage = ({ motorizadPage }: { motorizadPage: boolean }) => {
  const [filters, setFilters] = useState<Filters3<RhEmployee>>({})
  const [controller, setControler] = useState(0)
  const [store, setStore] = useState('NULL')

  const filtersCleaned = useMemo(() => {
    const newFilters: Filters3<RhEmployee> = {}
    for (const key in filters) {
      const value = filters[key as keyof RhEmployee]
      if (value?.[1]) {
        newFilters[key as keyof RhEmployee] = value
      }
    }
    return newFilters
  }, [filters])

  useEffect(() => {
    if (Object.keys(filters).length == 0 && controller > 0) {
      setControler(0)
    }
  }, [filters])

  const query = useQuery({
    queryKey: ['employees/filter', controller],
    queryFn: () => {
      return rhApi.filterEmployees({
        filters: filtersCleaned,
        relations: {
          sucursal: true,
          jobtitle: true,
        },
      })
    },
  })

  return (
    <EmpleadoContext.Provider
      value={{
        filters,
        setFilters,
        isLoading: query.isLoading,
        data: query.data?.data ?? [],
        setController: setControler,
        refetch: () => query.refetch(),
        store,
        setStore,
      }}
    >
      <div className="p-3 space-y-3">
        <NavEmployees motorizadPage={motorizadPage} />
        <EmployeesTable motorizadPage={motorizadPage} />
        <CreateEmployeeDrawer />
        <EditEmployeeDrawer onlyShow={motorizadPage} />
      </div>
    </EmpleadoContext.Provider>
  )
}

export const useEmpleadoContext = () => {
  const context = useContext(EmpleadoContext)
  if (!context) {
    throw new Error('useEmpleadoContext debe estar dentro del proveedor')
  }
  return context
}
