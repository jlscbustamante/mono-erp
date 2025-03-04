import { cn } from '@/utils'
import { EventClickArg } from '@fullcalendar/core/index.js'
import esLocale from '@fullcalendar/core/locales/es'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { Button } from 'antd'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useMemo, useRef } from 'react'
import './calendar.css'

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
  middleAddons,
  events,
  onClick,
  beforeAddons,
}: {
  addons?: React.ReactNode
  beforeAddons?: React.ReactNode
  middleAddons?: React.ReactNode
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
        <div className="flex items-center gap-3">
          <Button onClick={goBack} size="small">
            <ChevronLeft className="text-slate-600" />
          </Button>
          <span className="text-sm">{month}</span>
          <Button onClick={goNext} size="small">
            <ChevronRight className="text-slate-600" />
          </Button>
          {beforeAddons}
        </div>
        {addons}
      </div>
      {middleAddons}
      <FullCalendar
        // dayCellClassNames={'cursor-pointer'}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="dayGridMonth"
        dayHeaderClassNames={'bg-slate-100'}
        dayCellClassNames={'hover:!bg-blue-50 cursor-pointer !py-3 !px-2'}
        dayCellContent={(day) => {
          return (
            <div className="">
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-sm',
                  {
                    'bg-blue-500 text-white':
                      format(day.date, 'yyyy-MM-dd') ===
                      format(new Date(), 'yyyy-MM-dd'),
                  },
                )}
              >
                {day.dayNumberText}
              </div>
            </div>
          )
        }}
        eventContent={(eventInfo) => {
          return (
            <div className="flex flex-col gap-2 items-center">
              <p>{eventInfo.event.title}</p>
              <span className="py-1 px-2 bg-blue-500 rounded-md text-white">
                Solicitado
              </span>
            </div>
          )
        }}
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
      />
    </div>
  )
}
