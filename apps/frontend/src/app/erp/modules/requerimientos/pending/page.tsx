import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { IRequirementPresentation } from '@view'
import { Control } from './control'
import { DataTable } from './data-table'
import { NavRequest } from './nav'
import { usePendingStore } from './state'

export function PendingPage() {
  const filters = usePendingStore((st) => st.filters)

  const {
    data = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['requirements'],
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
        loading={isLoading || isFetching}
        onRefetch={() => {
          refetch()
        }}
      />
      <NavRequest />
      <DataTable data={data} />
    </div>
  )
}
