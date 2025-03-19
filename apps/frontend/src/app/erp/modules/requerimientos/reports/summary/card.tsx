import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { SummaryBox } from '@view'

export const Card = ({
  cashBank,
  date,
}: {
  cashBank: CashBankSelect
  date: string
}) => {
  const query = useQuery({
    queryKey: ['req:rep-summary'],
    queryFn: async () => {
      const data = await viewClient.api.view.requirement.report.summary.$get({
        query: {
          cashId: cashBank.id.toString(),
          date: date,
        },
      })
      const body = await data.json()
      return body.data as SummaryBox
    },
  })
  return (
    <div className="">
      <div className="font-bold">{cashBank.cashbank}</div>
      <div>
        <p>SALDO INICIAL</p>
        <p>{query.data?.initial ?? 0}</p>
      </div>

      <div>
        {query.data?.list.map((item) => {
          return (
            <div key={item.title}>
              <span>{item.title}</span>
              <span>{item.total}</span>
            </div>
          )
        })}
      </div>
      <div>
        <p>SALDO FINAL</p>
        <p>{query.data?.final ?? 0}</p>
      </div>
    </div>
  )
}
