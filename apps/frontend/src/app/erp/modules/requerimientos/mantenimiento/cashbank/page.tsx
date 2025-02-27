import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Control } from './control'
import { DataTable } from './data-table'
import { CreateCashBank } from './drawers/create'
import { UpdateCashBank } from './drawers/edit'
import { useCashBank } from './state'

export default function CashBankPage() {
  const filters = useCashBank((st) => st.filters)

  const { data, refetch } = useQuery({
    queryKey: ['req:cost-center'],
    queryFn: async () => {
      const data = await viewClient.api.view.cashbank.filter.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const body = await data.json()
      return body.data as CashBankSelect[]
    },
  })

  return (
    <div className="p-3 space-y-3">
      <Control onSearch={() => refetch?.()} />
      <DataTable data={data ?? []} />
      <CreateCashBank
        onUpdate={() => {
          refetch()
        }}
      />
      <UpdateCashBank
        onUpdate={() => {
          refetch()
        }}
      />
    </div>
  )
}
