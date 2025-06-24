import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CompanySelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

const useCompanies = () => {
  const query = useQuery({
    queryKey: ['rq:companies'],
    staleTime: Infinity,
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
    },
  })

  return query
}

export function CompanySelectForm({
  value,
  onChange,
}: {
  value?: string
  onChange?: (id: string | undefined) => void
  className?: string
}) {
  const { data: companies } = useCompanies()

  return (
    <Select
      value={value}
      onChange={(val) => {
        onChange?.(val ?? undefined)
      }}
      placeholder="Compañia"
      filterOption={filterSelectForm}
      showSearch={true}
      allowClear
    >
      {companies?.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.title}
        </Select.Option>
      ))}
    </Select>
  )
}

export function SupplierTitleForm({
  companyId,
}: {
  companyId: string | undefined
}) {
  const { data: companies } = useCompanies()

  return companies?.find((s) => s.id == companyId)?.title ?? undefined
}
