import { viewClient } from '@/lib/rpc'
import { MoveCashSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Control } from './control'
import { DataTable } from './data-table'
import { CreateCategory } from './drawers/create'
import { UpdateCategory } from './drawers/edit'
import { useCategory } from './state'

export default function CategoryPage() {
  const filters = useCategory((st) => st.filters)

  const { data, refetch } = useQuery({
    queryKey: ['req:category'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.movescash.$get({
          query: {
            filters: JSON.stringify(filters),
          },
        })
      const result = await request.json()
      return result.data as MoveCashSelect[]
    },
  })

  return (
    <div className="p-3 space-y-3">
      <Control onSearch={() => refetch?.()} />
      <DataTable data={data ?? []} />
      <CreateCategory
        onUpdate={() => {
          refetch()
        }}
      />
      <UpdateCategory
        onUpdate={() => {
          refetch()
        }}
      />
    </div>
  )
}
