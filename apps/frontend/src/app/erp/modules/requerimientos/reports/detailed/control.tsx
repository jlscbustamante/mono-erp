import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { useDetailedStore } from './state'

export const Control = ({ loading }: { loading: boolean }) => {
  const date = useDetailedStore((st) => st.date)
  const cashId = useDetailedStore((st) => st.cashId)
  const setDate = useDetailedStore((st) => st.setDate)
  const setCashId = useDetailedStore((st) => st.setCashId)
  const refetch = useDetailedStore((st) => st.refetch)

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

  return (
    <div className="space-x-2">
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
        onChange={(val) => {
          setCashId(val)
        }}
      >
        {query.data?.map((item) => {
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
