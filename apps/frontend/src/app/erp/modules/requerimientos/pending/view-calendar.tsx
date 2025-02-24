import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { viewClient } from '@/lib/rpc'
import { RequirementSelect, WhereOption } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_STATUS } from '@view'
import { Select } from 'antd'
import { format, parseISO } from 'date-fns'
import { Calendar, Logs } from 'lucide-react'
import { useMemo, useReducer, useState } from 'react'
import { CalendarComponent } from '../calendar'
import { SupplierSelectForm } from '../components/supplier-select'
import { usePendingStore } from './state'

const calendarOptions: FilterOption<RequirementSelect>[] = [
  {
    key: 'pay_method',
    label: 'Metodo de pago',
    operators: ['equal'],
    whereOption: {
      field: 'pay_method',
    },
    default: () => 'CREDITO',
    render: ({ fiValue, onFiChange }) => {
      return (
        <Select placeholder="pago" value={fiValue} onChange={onFiChange}>
          <Select.Option value="CONTADO">CONTADO</Select.Option>
          <Select.Option value="CREDITO">CREDITO</Select.Option>
        </Select>
      )
    },
  },
]

export function ViewCalendar({ toggleView }: { toggleView?: () => void }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const filters = usePendingStore((st) => st.filters)
  const setFilter = usePendingStore((st) => st.setFilters)

  const [calendarFilters, setCalendarFilters] = useState<
    WhereOption<RequirementSelect>[]
  >([])
  const supplierId = useMemo(() => {
    return calendarFilters.find((el) => el.field == 'supplier_id')?.value as
      | number
      | undefined
  }, [calendarFilters])

  const changeSupplierId = (id: number | undefined) => {
    const exist = calendarFilters.find((el) => el.field == 'supplier_id')
    if (id == undefined) {
      setCalendarFilters(
        calendarFilters.filter((el) => el.field != 'supplier_id'),
      )
      return
    }
    if (exist) {
      setCalendarFilters(
        calendarFilters.map((el) => {
          if (el.field == 'supplier_id') {
            return {
              ...el,
              value: id,
            }
          }
          return el
        }),
      )
    } else {
      setCalendarFilters([
        ...calendarFilters,
        {
          field: 'supplier_id',
          key: 'supplier_id',
          operator: 'equal',
          value: id,
        },
      ])
    }
  }
  const [control, setControl] = useReducer((c) => c + 1, 0)

  const query = useQuery({
    queryKey: ['rq:pending-calendar', control],
    queryFn: async () => {
      const month = parseISO(date).getMonth() + 1
      const request =
        await viewClient.api.view.requirement.requirementAmountsMonth.$get({
          query: {
            month: month.toString(),
            status: [REQUIREMENT_STATUS.PENDING],
            filters:
              calendarFilters.length > 0
                ? JSON.stringify(calendarFilters)
                : undefined,
          },
        })

      const data = await request.json()
      return data.data as { date: string; total: string }[]
    },
  })

  const handleClick = (date: string) => {
    setFilter(
      filters.map((el) => {
        if (el.field == 'requested_at') {
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
          title: `S/ ${d.total}<br >Solicitados`,
        }))}
        beforeAddons={
          <div className="flex gap-1 items-center">
            <SupplierSelectForm
              supplierId={supplierId}
              setSupplierId={changeSupplierId}
            />
            <FilterComponent
              options={calendarOptions}
              filters={calendarFilters}
              setFilters={setCalendarFilters}
              onSearch={(searchFilters) => {
                console.log('search : ', searchFilters)
                setControl()
              }}
            />
          </div>
        }
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
