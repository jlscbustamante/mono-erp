import { useApprovedStore } from './state'
import { ViewCalendar } from './view-calendar'
import { ViewTable } from './view-table'

export function ApprovedPage() {
  const view = useApprovedStore((st) => st.view)
  const setView = useApprovedStore((st) => st.setView)

  const toggleView = () => {
    setView(view === 'list' ? 'calendar' : 'list')
  }

  return (
    <div className="p-3">
      {view === 'list' ? (
        <ViewTable toggleView={toggleView} />
      ) : (
        <ViewCalendar toggleView={toggleView} />
      )}
    </div>
  )
}
