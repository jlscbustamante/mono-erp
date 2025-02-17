import esLocale from '@fullcalendar/core/locales/es'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { Button } from 'antd'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

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

export const Calendar = () => {
  const calendarRef = useRef<any>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

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

  return (
    <div>
      <div className="flex items-center mb-3 gap-3">
        <Button onClick={goBack} size="small">
          <ChevronLeft className="text-slate-600" />
        </Button>
        <span>{month}</span>
        <Button onClick={goNext} size="small">
          <ChevronRight className="text-slate-600" />
        </Button>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        headerToolbar={false}
        initialView="dayGridMonth"
        height={'auto'}
        locale={esLocale}
        events={[
          {
            title: 'S/ 30,400.30<br>Aprobados',
            date: '2025-02-17',
            className: 'bg-transparent border border-none text-center',
            textColor: 'black',
          },
          {
            title: 'S/ 30,400.30<br>Aprobados',
            date: '2025-02-19',
            className: 'bg-transparent border border-none text-center',
            textColor: 'black',
          },
        ]}
        eventContent={(arg) => {
          return {
            html: arg.event.title,
          }
        }}
      />
    </div>
  )
}
