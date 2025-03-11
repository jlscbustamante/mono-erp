import { viewClient } from '@/lib/rpc'
import { RequirementRelationsSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Control } from './control'
import { useDetailedStore } from './state'
import { DataTable } from './table'

export default function RequirementDetailedPage() {
  const date = useDetailedStore((st) => st.date)
  const cashId = useDetailedStore((st) => st.cashId)
  const controlRefetch = useDetailedStore((st) => st.controlRefetch)

  const query = useQuery({
    queryKey: ['req:rep-detailed', controlRefetch],
    enabled: cashId != null,
    queryFn: async () => {
      const data = await viewClient.api.view.requirement.report.detailed.$get({
        query: {
          date,
          cashAccountId: cashId,
        },
      })
      const body = await data.json()
      // return body.data as RequirementRelationsSelect[]
      return {
        data: body.data as RequirementRelationsSelect[],
        cashId: cashId!,
      }
    },
  })

  const initialQuery = useQuery({
    queryKey: ['req:rep-initial-balance', controlRefetch],
    enabled: cashId != null,
    queryFn: async () => {
      const data =
        await viewClient.api.view.requirement.report.initial_balance.$get({
          query: {
            date,
            cashId,
          },
        })
      const body = await data.json()
      return body.data as number
    },
  })

  return (
    <div className="p-3 space-y-3">
      <Control loading={query.isLoading} />
      {query?.data ? (
        <DataTable
          data={query.data.data}
          cashId={query.data.cashId}
          initial={initialQuery.data ?? 0}
        />
      ) : null}
    </div>
  )
}
