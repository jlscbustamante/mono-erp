import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { IRequirementPresentation, REQUIERMENT_TYPE } from '@view'
import { useMemo } from 'react'
import { Control } from './control'
import { DataTable } from './data-table'
import { NavRequest } from './nav'
import { useApprovedStore } from './state'

export function ViewTable() {
  const filters = useApprovedStore((st) => st.filters)
  const controlRefetch = useApprovedStore((st) => st.controlRefetch)

  const requirementType = useMemo(() => {
    const requestType = filters.find((el) => {
      return el.field == 'request_type'
    })
    return requestType?.value as REQUIERMENT_TYPE
  }, [filters])

  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rq:approved-req', requirementType, controlRefetch],
    queryFn: async () => {
      const request = await viewClient.api.view.requirement.filter.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const data = await request.json()
      return data.data as IRequirementPresentation[]
    },
  })
  return (
    <div>
      <Control loading={isLoading || isFetching} />
      <NavRequest />
      <DataTable data={data} type={requirementType} />
    </div>
  )
}
