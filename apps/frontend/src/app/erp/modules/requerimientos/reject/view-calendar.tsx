import { FilterComponent } from '@/components/fifi'
import { viewClient } from '@/lib/rpc'
import { fCurrency } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_STATUS } from '@view'
import { parseISO } from 'date-fns'
import { useMemo } from 'react'
import { CalendarComponent } from '../calendar'
import { SupplierSelectForm } from '../components/supplier-select'
import { CompanySelectReject } from './company-select'
import { menuOptions } from './control'
import { NavRequest } from './nav'
import { useRejectedStore } from './state'
import { SwitchViewReject } from './switch-view-reject'

export function ViewCalendar() {
  const date = useRejectedStore((st) => st.dateCalendar)
  const setDate = useRejectedStore((st) => st.setDateCalendar)
  const filters = useRejectedStore((st) => st.filters)
  const setFilter = useRejectedStore((st) => st.setFilters)
  const controlRefetch = useRejectedStore((st) => st.controlRefetch)
  const refetch = useRejectedStore((st) => st.refetch)
  const toggleView = useRejectedStore((st) => st.setView)

  const month = useMemo(() => {
    return parseISO(date).getMonth() + 1
  }, [date])

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
    queryKey: ['rq:reject-calendar', controlRefetch, date],
    queryFn: async () => {
      const month = parseISO(date).getMonth() + 1
      const filtersWithoutDate = filters.filter(
        (el) => el.field != 'requested_at',
      )
      const request =
        await viewClient.api.view.requirement.requirementAmountsMonth.$get({
          query: {
            month: month.toString(),
            status: [REQUIREMENT_STATUS.CANCELLED],
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
    toggleView('list')
  }

  return (
    <div>
      <CalendarComponent
        date={date}
        onClick={handleClick}
        setDate={setDate}
        middleAddons={<NavRequest month={month} />}
        beforeAddons={
          <div className="flex gap-1 items-center">
            <CompanySelectReject />
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
                refetch()
              }}
            />
          </div>
        }
        titleBadge="Rechazado"
        events={query.data?.map((d) => ({
          date: d.date,
          title: `${fCurrency(d.total)}`,
        }))}
        addons={<SwitchViewReject />}
      />
    </div>
  )
}
