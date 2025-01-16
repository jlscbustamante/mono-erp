import { rhApi } from '@/lib/api/rh'
import { useQuery } from '@tanstack/react-query'
import { ColumnsType } from 'antd/es/table'
import { format, parseISO } from 'date-fns'
import { Attendance } from 'pizzadb'
import { createContext, useContext, useReducer } from 'react'
import { AttendanceTable } from './attendance-table'
import { NavAsistencia } from './nav-asistencia'
import { useAttendanceStore } from './state'

const AsistenciaContext = createContext<any>(null)

export const AsistenciaPage = () => {
  const [controller, addController] = useReducer((state) => state + 1, 0)
  const filter = useAttendanceStore((st) => st.filters)

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Empleado',
      render: (_, record: Attendance) => {
        return `${record.employee.first_name} ${record.employee.last_name}`
      },
    },
    {
      title: 'Evento',
      dataIndex: 'event',
    },
    {
      title: 'Fecha',
      dataIndex: 'attendance_at',
      render: (text: string) => format(parseISO(text), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      title: 'Tienda',
      dataIndex: ['sucursal', 'title'],
    },
    {
      title: 'Imagen',
      dataIndex: 'pic_photo',
      render: (url: string) => {
        if (url === null) return 'Sin imagen'
        return (
          <a
            target="_blank"
            href={`https://erpraul.com/api/attendance/_img/${url}`}
            rel="noreferrer"
          >
            Abrir
          </a>
        )
      },
      excelRender: (url: string) =>
        url ? `https://erpraul.com/api/attendance/_img/${url}` : 'Sin imagen',
    } as any,
  ] satisfies ColumnsType<Attendance>

  const query = useQuery({
    queryKey: ['asistencias/filter', controller],
    enabled: controller > 0,
    // queryFn: () => rhApi.filterAssistance(store!, dates, userId),
    queryFn: () => rhApi.filterAssistanceFillime(filter),
    staleTime: 1000 * 60,
  })

  return (
    <AsistenciaContext.Provider
      value={{
        columns,
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
    data: Attendance[]
    isLoading: boolean
    addController: () => void
    columns: ColumnsType<Attendance>
  }
}
