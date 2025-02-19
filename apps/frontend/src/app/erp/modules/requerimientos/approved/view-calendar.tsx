import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_STATUS } from '@view'
import { format, parseISO } from 'date-fns'
import { Calendar, Logs } from 'lucide-react'
import { useState } from 'react'
import { CalendarComponent } from '../calendar'
import { useApprovedStore } from './state'

export function ViewCalendar({ toggleView }: { toggleView?: () => void }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const filters = useApprovedStore((st) => st.filters)
  const setFilter = useApprovedStore((st) => st.setFilters)

  const query = useQuery({
    queryKey: ['rq:approved-calendar', date],
    queryFn: async () => {
      const month = parseISO(date).getMonth() + 1
      const request =
        await viewClient.api.view.requirement.requirementAmountsMonth.$get({
          query: {
            month: month.toString(),
            status: [REQUIREMENT_STATUS.APPROVED],
            fieldDate: 'approved',
          },
        })

      const data = await request.json()
      return data.data as { date: string; total: string }[]
    },
  })

  const handleClick = (date: string) => {
    setFilter(
      filters.map((el) => {
        if (el.field == 'approved_at') {
          return {
            ...el,
            value: [date, date],
          }
        }
        return el
      }),
    )
    toggleView?.()
  }

  return (
    <div>
      <CalendarComponent
        onClick={handleClick}
        date={date}
        setDate={setDate}
        events={query.data?.map((d) => ({
          date: d.date,
          title: `S/ ${d.total}<br >Aprobados`,
        }))}
        addons={
          <div className="flex border border-solid border-slate-300 rounded-md ml-2">
            <div
              className="p-1 flex items-center justify-center cursor-pointer"
              onClick={toggleView}
            >
              <Logs className="w-5 h-auto" />
            </div>
            <div className="px-2 py-1 flex items-center justify-center bg-slate-200">
              <Calendar className="w-5 h-auto" />
            </div>
          </div>
        }
      />
    </div>
  )
}
