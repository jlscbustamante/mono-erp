import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

const useCashBank = () => {
  const query = useQuery({
    queryKey: ['req:cash-bank'],
    queryFn: async () => {
      const data = await viewClient.api.view.cashbank.filter.$get()
      const body = await data.json()
      return body.data as CashBankSelect[]
    },
  })
  return query
}

export function CashBankForm({
  value,
  onChange,
}: {
  value?: number
  onChange?: (id: number | undefined) => void
}) {
  const { data: cashbanks } = useCashBank()

  return (
    <Select
      className="w-64"
      value={value}
      onChange={(val) => {
        onChange?.(val ? +val : undefined)
      }}
      placeholder="Tiendas"
      filterOption={filterSelectForm}
      showSearch={true}
      allowClear
    >
      {cashbanks?.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.cashbank}
        </Select.Option>
      ))}
    </Select>
  )
}

export function CashBankTitleForm({ cashBankId }: { cashBankId: number }) {
  const { data: cashbanks } = useCashBank()

  return cashbanks?.find((s) => s.id == cashBankId)?.cashbank ?? undefined
}
