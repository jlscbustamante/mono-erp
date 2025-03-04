import { usePendingStore } from './state'
import { ViewCalendar } from './view-calendar'
import { ViewTable } from './view-table'

export function PendingPage() {
  const view = usePendingStore((st) => st.view)

  return (
    <div className="p-3">
      {view === 'list' ? <ViewTable /> : <ViewCalendar />}
    </div>
  )
}
