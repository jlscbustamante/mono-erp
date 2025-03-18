import { REQUIERMENT_TYPE } from '@view'
import { useMemo } from 'react'
import { SelectRequestType } from '../components/select-request-type'
import { useRejectedStore } from './state'

export function NavRequest({ month }: { month?: number }) {
  const filters = useRejectedStore((st) => st.filters)
  const setFilter = useRejectedStore((st) => st.setFilters)
  const refetch = useRejectedStore((st) => st.refetch)
  const controlRefetch = useRejectedStore((st) => st.controlRefetch)

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
    refetch()
  }

  return (
    <SelectRequestType
      className="my-2"
      value={type}
      month={month}
      controlRefetch={controlRefetch}
      onChange={changeType}
      filters={filters}
    />
  )
}
