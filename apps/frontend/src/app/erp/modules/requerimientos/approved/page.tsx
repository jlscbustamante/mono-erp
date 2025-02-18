import { useState } from 'react'
import { ViewCalendar } from './view-calendar'
import { ViewTable } from './view-table'

export function ApprovedPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')

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
