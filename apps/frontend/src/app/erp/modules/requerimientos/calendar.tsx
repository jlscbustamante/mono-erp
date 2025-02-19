import { EventClickArg } from '@fullcalendar/core/index.js'
import esLocale from '@fullcalendar/core/locales/es'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { Button } from 'antd'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useMemo, useRef } from 'react'

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const CalendarComponent = ({
  addons,
  date,
  setDate,
  events,
  onClick,
}: {
  addons?: React.ReactNode
  date: string
  events?: {
    title: string
    date: string
  }[]
  setDate: (date: string) => void
  onClick?: (date: string) => void
}) => {
  const calendarRef = useRef<any>(null)
  // const [currentDate, setCurrentDate] = useState(new Date())
  const currentDate = useMemo(() => {
    return parseISO(date)
  }, [date])

  const setCurrentDate = (date: Date) => {
    setDate(format(date, 'yyyy-MM-dd'))
  }

  const month = useMemo(() => {
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }, [currentDate])

  const goNext = () => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.next()
    setCurrentDate(calendarApi.getDate())
  }

  const goBack = () => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.prev()
    setCurrentDate(calendarApi.getDate())
  }

  const handleDateClick = (arg: DateClickArg) => {
    const date = format(arg.date, 'yyyy-MM-dd')
    onClick?.(date)
  }

  const handleEventClick = (info: EventClickArg) => {
    if (info.event.start) {
      const date = format(info.event.start, 'yyyy-MM-dd')
      onClick?.(date)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center mb-3 gap-3">
          <Button onClick={goBack} size="small">
            <ChevronLeft className="text-slate-600" />
          </Button>
          <span>{month}</span>
          <Button onClick={goNext} size="small">
            <ChevronRight className="text-slate-600" />
          </Button>
        </div>
        {addons}
      </div>
      <FullCalendar
        dayCellClassNames={'cursor-pointer'}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="dayGridMonth"
        height={'auto'}
        locale={esLocale}
        events={events?.map((el) => {
          return {
            title: el.title,
            date: el.date,

            className: 'bg-transparent border border-none text-center',
            textColor: 'black',
          }
        })}
        eventContent={(arg) => {
          return {
            html: arg.event.title,
          }
        }}
      />
    </div>
  )
}
