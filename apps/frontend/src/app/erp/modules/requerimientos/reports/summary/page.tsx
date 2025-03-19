import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Card } from './card'

export default function RequirementSummaryPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const cashbankQuery = useQuery({
    queryKey: ['req:rs:cash-bank'],
    queryFn: async () => {
      const data =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const body = await data.json()
      return body.data as CashBankSelect[]
    },
  })
  return (
    <div className="p-3">
      <div className="flex gap-2 items-center">
        <DatePicker
          allowClear={false}
          value={dayjs(date)}
          onChange={(val) => {
            if (val) {
              setDate(val.format('yyyy-MM-dd'))
            }
          }}
        />
        <Button type="primary">Buscar</Button>
      </div>
      <div>
        {cashbankQuery.data?.map((cs) => {
          return <Card cashBank={cs} key={cs.id} date={date} />
        })}
      </div>
    </div>
  )
}
