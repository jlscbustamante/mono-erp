import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { IRequirementPresentation } from '@view'
import { Control } from './control'
import { DataTable } from './data-table'
import { NavRequest } from './nav'
import { useApprovedStore } from './state'

export function ViewTable() {
  const filters = useApprovedStore((st) => st.filters)

  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rq:approved-req'],
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
      <DataTable data={data} />
    </div>
  )
}
