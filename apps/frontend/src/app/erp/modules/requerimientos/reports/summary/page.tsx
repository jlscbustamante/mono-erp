import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../components/company-select'
import { Card } from './card'
import { use_summary_store } from './state'

export default function RequirementSummaryPage() {
  const date = use_summary_store((st) => st.date)
  const set_date = use_summary_store((st) => st.set_date)
  const company_id = use_summary_store((st) => st.company_id)
  const set_company_id = use_summary_store((st) => st.set_company_id)
  const refetch = use_summary_store((st) => st.refetch)
  const control_refetch = use_summary_store((st) => st.control_refetch)
  const cashbankQuery = useQuery({
    queryKey: ['req:rs:cash-bank'],
    queryFn: async () => {
      const data =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const body = await data.json()
      return body.data as CashBankSelect[]
    },
  })

  const cash_banks = useMemo(() => {
    if (!cashbankQuery.data) return []
    let list: CashBankSelect[] = cashbankQuery.data ?? []
    if (company_id) {
      list = list.filter((cb) => cb.company_id === company_id)
    }
    return list
  }, [cashbankQuery.data, control_refetch])

  return (
    <div className="p-3 pb-12">
      <div className="flex gap-2 items-center mb-3">
        <CompanySelectForm
          value={company_id}
          onChange={(val) => {
            set_company_id(val)
          }}
        />
        <DatePicker
          allowClear={false}
          value={dayjs(date)}
          onChange={(val) => {
            if (val) {
              set_date(val.format('YYYY-MM-DD'))
            }
          }}
        />
        <Button type="primary" onClick={() => refetch()}>
          Buscar
        </Button>
      </div>
      <div className="grid gap-3 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
        {cash_banks?.map((cs) => {
          return (
            <Card
              cashBank={cs}
              key={cs.id}
              date={date}
              control_refetch={control_refetch}
            />
          )
        })}
      </div>
    </div>
  )
}
