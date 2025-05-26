import { REQUIREMENT_TYPE } from '@view'
import { useMemo } from 'react'
import { SelectRequestType } from '../components/select-request-type'
import { useApprovedStore } from './state'

export function NavRequest({ month }: { month?: number }) {
  const filters = useApprovedStore((st) => st.filters)
  const setFilter = useApprovedStore((st) => st.setFilters)
  const refetch = useApprovedStore((st) => st.refetch)
  const controlRefetch = useApprovedStore((st) => st.controlRefetch)

  const type = useMemo(() => {
    return filters.find((el) => el.field == 'request_type')
      ?.value as REQUIREMENT_TYPE
  }, [filters])

  const changeType = (type: REQUIREMENT_TYPE) => {
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
      month={month}
      className="my-2"
      value={type}
      controlRefetch={controlRefetch}
      onChange={changeType}
      filters={filters}
    />
  )
}
