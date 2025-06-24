import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { ProductSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

const useProducts = () => {
  const query = useQuery({
    queryKey: ['rq:products'],
    staleTime: Infinity,
    queryFn: async () => {
      const request = await viewClient.api.view.product.all.$get()
      const result = await request.json()
      return result.data as ProductSelect[]
    },
  })

  return query
}

export function ProductSelectForm({
  value,
  onChange,
}: {
  value?: string
  onChange?: (id: string | undefined) => void
  className?: string
}) {
  const { data: products } = useProducts()

  return (
    <Select
      value={value}
      onChange={(val) => {
        onChange?.(val ?? undefined)
      }}
      placeholder="Producto"
      filterOption={filterSelectForm}
      showSearch={true}
      allowClear
    >
      {products?.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.product}
        </Select.Option>
      ))}
    </Select>
  )
}
