import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { SupplierSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_STATUS } from '@view'
import { Button, Select } from 'antd'
import { format, parseISO } from 'date-fns'
import { Calendar, Logs, Search, X } from 'lucide-react'
import { useReducer, useState } from 'react'
import { CalendarComponent } from '../calendar'
import { useRejectedStore } from './state'

export function ViewCalendar({ toggleView }: { toggleView?: () => void }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const filters = useRejectedStore((st) => st.filters)
  const setFilter = useRejectedStore((st) => st.setFilters)
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined)
  const [control, setControl] = useReducer((c) => c + 1, 0)

  const query = useQuery({
    queryKey: ['rq:reject-calendar', control],
    queryFn: async () => {
      const month = parseISO(date).getMonth() + 1
      const request =
        await viewClient.api.view.requirement.requirementAmountsMonth.$get({
          query: {
            month: month.toString(),
            status: [REQUIREMENT_STATUS.CANCELLED],
            fieldDate: 'rejected',
            supplierId,
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

  const { data: suppliers } = useQuery({
    queryKey: ['rq:suppliers'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
    },
  })

  return (
    <div>
      <CalendarComponent
        date={date}
        onClick={handleClick}
        setDate={setDate}
        beforeAddons={
          <div className="flex gap-1 items-center">
            <Select
              className="w-64"
              placeholder="Filtrar por proveedor"
              value={supplierId}
              onChange={(val) => {
                setSupplierId(val ?? undefined)
              }}
              filterOption={filterSelectForm}
              showSearch={true}
              allowClear
            >
              {suppliers?.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.supplier}
                </Select.Option>
              ))}
            </Select>
            <div className="flex items-center gap-1">
              <Button
                // variant={'filled'}
                type="primary"
                icon={<Search className="w-4 h-4" />}
                // className="p-3 h-8 w-8"
                className="rounded-full"
                onClick={() => {
                  setControl()
                }}
              >
                {/* <Search className="w-4 h-4" /> */}
              </Button>
              <Button
                variant={'filled'}
                // className="p-3 h-8 w-8"
                className="rounded-full"
                danger
                type="primary"
                onClick={() => {
                  setSupplierId(undefined)
                  setControl()
                }}
                icon={<X className="w-4 h-4" />}
              ></Button>
            </div>
          </div>
        }
        events={query.data?.map((d) => ({
          date: d.date,
          title: `S/ ${d.total}<br >Cancelados`,
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
