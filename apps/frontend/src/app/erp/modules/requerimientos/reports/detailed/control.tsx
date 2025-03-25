import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../components/company-select'
import { useDetailedStore } from './state'

export const Control = ({ loading }: { loading: boolean }) => {
  const date = useDetailedStore((st) => st.date)
  const cashId = useDetailedStore((st) => st.cashId)
  const setDate = useDetailedStore((st) => st.setDate)
  const setCashId = useDetailedStore((st) => st.setCashId)
  const refetch = useDetailedStore((st) => st.refetch)
  const company_id = useDetailedStore((st) => st.company_id)
  const set_company_id = useDetailedStore((st) => st.set_company_id)

  const query = useQuery({
    queryKey: ['req:cash-bank'],
    queryFn: async () => {
      const data = await viewClient.api.view.cashbank.filter.$get({
        query: {
          filters: JSON.stringify([]),
        },
      })
      const body = await data.json()
      return body.data as CashBankSelect[]
    },
  })

  const cashbanks = useMemo(() => {
    if (!query.data) return []

    if (company_id) {
      return query.data.filter((item) => item.company_id === company_id)
    }
    return query.data
  }, [query.data, company_id])

  return (
    <div className="space-x-2">
      <CompanySelectForm
        value={company_id}
        onChange={(val) => set_company_id(val)}
      />
      <DatePicker
        className="w-60"
        allowClear={false}
        value={dayjs(date)}
        onChange={(e) => {
          if (e) {
            setDate(e.format('YYYY-MM-DD'))
          }
        }}
      />
      <Select
        className="w-60"
        placeholder="Caja/Banco"
        value={cashId}
        filterOption={filterSelectForm}
        showSearch
        onChange={(val) => {
          setCashId(val)
        }}
      >
        {cashbanks.map((item) => {
          return (
            <Select.Option value={item.id} key={item.id}>
              {item.cashbank}
            </Select.Option>
          )
        })}
      </Select>
      <Button
        type="primary"
        className="w-40"
        onClick={refetch}
        loading={loading}
      >
        Buscar
      </Button>
    </div>
  )
}
