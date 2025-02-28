import { REQUIERMENT_TYPE } from '@view'
import { useMemo } from 'react'
import { SelectRequestType } from '../components/select-request-type'
import { usePendingStore } from './state'

export function NavRequest({ onRefetch }: { onRefetch?: () => void }) {
  const filters = usePendingStore((st) => st.filters)
  const setFilter = usePendingStore((st) => st.setFilters)

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
    onRefetch?.()
  }
  return (
    <SelectRequestType className="my-2" value={type} onChange={changeType} />
  )
}
