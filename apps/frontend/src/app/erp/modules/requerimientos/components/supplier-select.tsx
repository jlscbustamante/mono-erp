import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { SupplierSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

export function SupplierSelectForm({
  supplierId,
  setSupplierId,
}: {
  supplierId: number | undefined
  setSupplierId: (id: number | undefined) => void
}) {
  const { data: suppliers } = useQuery({
    queryKey: ['rq:suppliers'],
    staleTime: Infinity,
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
    },
  })

  return (
    <Select
      className="w-64"
      value={supplierId}
      onChange={(val) => {
        setSupplierId(val ?? undefined)
      }}
      placeholder="Filtrar por proveedor"
      filterOption={filterSelectForm}
      showSearch={true}
      allowClear
    >
      {suppliers?.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.supplier}
        </Select.Option>
      ))}
    </Select>
  )
}

export function SupplierTitleForm({
  supplierId,
}: {
  supplierId: number | undefined
}) {
  const { data: suppliers } = useQuery({
    queryKey: ['rq:suppliers'],
    staleTime: Infinity,
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
    },
  })

  return suppliers?.find((s) => s.id == supplierId)?.supplier ?? undefined
}
