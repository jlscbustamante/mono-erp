import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { IRequirementPresentation } from '@view'
import { Control } from './control'
import { DataTable } from './data-table'
import { NavRequest } from './nav'
import { useApprovedStore } from './state'

export function RejectPage() {
  const filters = useApprovedStore((st) => st.filters)

  const { data = [], refetch } = useQuery({
    queryKey: ['rq:rejeceted-req'],
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
    <div className="p-3">
      <Control
        onRefetch={() => {
          refetch()
        }}
      />
      <NavRequest />
      <DataTable data={data} />
    </div>
  )
}
