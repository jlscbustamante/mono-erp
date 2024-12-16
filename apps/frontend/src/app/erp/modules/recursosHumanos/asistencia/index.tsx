import { rhApi } from '@/lib/api/rh'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Attendance } from 'pizzadb'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from 'react'
import { AttendanceTable } from './attendance-table'
import { NavAsistencia } from './nav-asistencia'

const AsistenciaContext = createContext<any>(null)

export const AsistenciaPage = () => {
  const [store, setStore] = useState<undefined | string>(undefined)
  const [dates, setDates] = useState([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])
  const [controller, addController] = useReducer((state) => state + 1, 0)

  const query = useQuery({
    queryKey: ['asistencias/filter', controller],
    enabled: !!store,
    queryFn: () => rhApi.filterAssistance(store!, dates),
  })

  return (
    <AsistenciaContext.Provider
      value={{
        store,
        setStore,
        dates,
        setDates,
        data: query.data ?? [],
        isLoading: query.isLoading,
        addController,
      }}
    >
      <div className="p-3 space-y-2">
        <NavAsistencia />
        <AttendanceTable />
      </div>
    </AsistenciaContext.Provider>
  )
}

export const useAsistenciaContext = () => {
  const context = useContext(AsistenciaContext)
  if (!context) {
    throw new Error('useAsistenciaContext debe estar dentro del proveedor')
  }
  return context as {
    store: string | undefined
    setStore: Dispatch<SetStateAction<string | undefined>>
    dates: string[]
    setDates: Dispatch<SetStateAction<string[]>>
    data: Attendance[]
    isLoading: boolean
    addController: () => void
  }
}
