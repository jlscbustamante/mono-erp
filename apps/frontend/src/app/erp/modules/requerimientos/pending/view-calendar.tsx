import { FilterComponent } from '@/components/fifi'
import { viewClient } from '@/lib/rpc'
import { fCurrency } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { REQUIERMENT_TYPE, REQUIREMENT_STATUS } from '@view'
import { format, parseISO } from 'date-fns'
import { Calendar, Logs } from 'lucide-react'
import { useMemo, useReducer, useState } from 'react'
import { CalendarComponent } from '../calendar'
import { SelectRequestType } from '../components/select-request-type'
import { SupplierSelectForm } from '../components/supplier-select'
import { menuOptions } from './control'
import { usePendingStore } from './state'

export function ViewCalendar({ toggleView }: { toggleView?: () => void }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const filters = usePendingStore((st) => st.filters)
  const setFilter = usePendingStore((st) => st.setFilters)
  const [control, setControl] = useReducer((c) => c + 1, 0)

  const type = useMemo(() => {
    return filters.find((el) => el.field == 'request_type')
      ?.value as REQUIERMENT_TYPE
  }, [filters])

  const changeType = (type: REQUIERMENT_TYPE) => {
    setFilter(
      filters.map((el) => {
        if (el.field == 'request_type') {
          return {
            ...el,
            value: type,
          }
        }
        return el
      }),
    )
    setControl()
  }

  const supplierId = useMemo(() => {
    return filters.find((el) => el.field == 'supplier_id')?.value as
      | number
      | undefined
  }, [filters])

  const changeSupplierId = (id: number | undefined) => {
    const exist = filters.find((el) => el.field == 'supplier_id')
    if (id == undefined) {
      setFilter(filters.filter((el) => el.field != 'supplier_id'))
      return
    }
    if (exist) {
      setFilter(
        filters.map((el) => {
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
      setFilter([
        ...filters,
        {
          field: 'supplier_id',
          key: 'supplier_id',
          operator: 'equal',
          value: id,
        },
      ])
    }
  }

  const query = useQuery({
    queryKey: ['rq:pending-calendar', control],
    queryFn: async () => {
      const month = parseISO(date).getMonth() + 1
      const filtersWithoutDate = filters.filter(
        (el) => el.field != 'requested_at',
      )
      const request =
        await viewClient.api.view.requirement.requirementAmountsMonth.$get({
          query: {
            month: month.toString(),
            status: [REQUIREMENT_STATUS.PENDING],
            filters:
              filtersWithoutDate.length > 0
                ? JSON.stringify(filtersWithoutDate)
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
        middleAddons={
          <SelectRequestType
            className="mb-2"
            value={type}
            onChange={changeType}
          />
        }
        onClick={handleClick}
        date={date}
        setDate={setDate}
        events={query.data?.map((d) => ({
          date: d.date,
          title: fCurrency(d.total).toString() ?? d.total,
        }))}
        beforeAddons={
          <div className="flex gap-1 items-center">
            <SupplierSelectForm
              value={supplierId}
              onChange={changeSupplierId}
            />
            <FilterComponent
              options={menuOptions.map((el) => {
                if (el.key == 'supplier_id') {
                  return {
                    ...el,
                    hide: true,
                  }
                }
                return el
              })}
              filters={filters}
              setFilters={setFilter}
              onSearch={() => {
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
