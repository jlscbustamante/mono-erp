import { FilterComponent } from '@/components/fifi'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { fCurrency } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_STATUS } from '@view'
import { Button } from 'antd'
import { parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { CalendarComponent } from '../calendar'
import { SupplierSelectForm } from '../components/supplier-select'
import { menuOptions } from './control'
import { NavRequest } from './nav'
import { usePendingStore } from './state'
import { SwitchViewPending } from './switch-view-pending'

export function ViewCalendar() {
  const date = usePendingStore((st) => st.dateCalendar)
  const setDate = usePendingStore((st) => st.setDateCalendar)
  const filters = usePendingStore((st) => st.filters)
  const setFilter = usePendingStore((st) => st.setFilters)
  const controlRefetch = usePendingStore((st) => st.controlRefetch)
  const refetch = usePendingStore((st) => st.refetch)
  const toggleView = usePendingStore((st) => st.setView)
  const navigate = useNavigate()

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
    queryKey: ['rq:pending-calendar', controlRefetch, date],
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
    toggleView('list')
  }

  return (
    <div>
      <CalendarComponent
        middleAddons={<NavRequest month={month} />}
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
              loading={query.isPending || query.isFetching}
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
        addons={
          <div className="flex gap-1 items-center">
            <Button
              size="middle"
              type="primary"
              onClick={() => {
                navigate(PATHS.erp.modulos.requerimientos.creation)
              }}
            >
              Nuevo requerimiento
            </Button>
            <SwitchViewPending />
          </div>
        }
      />
    </div>
  )
}
