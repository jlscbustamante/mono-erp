import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { StoreTableSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

const useStores = () => {
  const query = useQuery({
    queryKey: ['rq:stores'],
    staleTime: Infinity,
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.stores.$get()
      const result = await request.json()
      return result.data as StoreTableSelect[]
    },
  })

  return query
}

export function StoreSelectForm({
  value,
  onChange,
}: {
  value?: string
  onChange?: (id: string | undefined) => void
}) {
  const { data: stores } = useStores()

  return (
    <Select
      className="w-64"
      value={value}
      onChange={(val) => {
        onChange?.(val ?? undefined)
      }}
      placeholder="Tiendas"
      filterOption={filterSelectForm}
      showSearch={true}
      allowClear
    >
      {stores?.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.title}
        </Select.Option>
      ))}
    </Select>
  )
}

export function StoreTitleForm({ storeId }: { storeId: string | undefined }) {
  const { data: stores } = useStores()

  return stores?.find((s) => s.id == storeId)?.title ?? undefined
}
