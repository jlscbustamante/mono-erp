import { getDispatchesRoute } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import '../style-prin.css'
import { DispatchRoutesControl } from './controls'
import { DataTable } from './data-table'

export const DispatchRoute = () => {
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [control, setControl] = useState(0)
  const [categoriesSelected, setCategorySelected] = useState<string[]>([])

  const reload = () => setControl(control + 1)
  const [selectRoute, setSelectRoute] = useState<string | null>(null)
  const tableRef = useRef(null)
  const query = useQuery({
    queryKey: ['dispatches-routes', control],
    enabled: control > 0 && !!selectRoute,
    queryFn: async () => {
      return await getDispatchesRoute(date, selectRoute!)
    },
  })

  return (
    <div className="p-3">
      <DispatchRoutesControl
        categorySelected={categoriesSelected}
        setCategorySelected={setCategorySelected}
        tableRef={tableRef}
        date={date}
        setDate={setDate}
        reload={reload}
        selectRoute={selectRoute}
        setSelectRoute={setSelectRoute}
        loading={query.isLoading}
      />
      <DataTable
        dispatches={query.data ?? []}
        tableRef={tableRef}
        categoriesSelected={categoriesSelected}
      />
    </div>
  )
}
