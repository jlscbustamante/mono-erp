import { useDispatchConsolidated } from '@/hooks/data/iventory/use-dispatch-consolidated'
import { format, startOfWeek } from 'date-fns'
import { useRef, useState } from 'react'
import '../style-prin.css'
import { ConsolidatedByStoreDrawer } from './consolidated-by-store-drawer'
import { ConsolidatedControls } from './controls'
import { DispatchConsolidatedTable } from './data-table'

export const DispatchConsolidated = () => {
  const [dates, setDates] = useState([
    format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd'),
  ])
  const tableRef = useRef(null)
  const [categoriesSelected, setCategorySelected] = useState<string[]>([])

  const [control, setControl] = useState(0)
  const reload = () => setControl(control + 1)

  const query = useDispatchConsolidated({
    start: dates[0],
    end: dates[1],
    control,
  })

  return (
    <div className="p-3 space-y-3">
      <ConsolidatedControls
        data={query.data}
        categorySelected={categoriesSelected}
        setCategorySelected={setCategorySelected}
        dates={dates}
        tableRef={tableRef}
        setDates={setDates}
        reload={reload}
        isLoading={query.isLoading}
      />
      {query.error && (
        <div className="text-red-500 my-4">Error al cargar consolidado</div>
      )}
      {query.data && !query.error && (
        <DispatchConsolidatedTable
          data={query.data}
          tableRef={tableRef}
          categoriesSelected={categoriesSelected}
        />
      )}
      <ConsolidatedByStoreDrawer />
    </div>
  )
}
