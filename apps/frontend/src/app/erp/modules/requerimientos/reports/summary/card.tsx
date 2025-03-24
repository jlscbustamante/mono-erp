import { viewClient } from '@/lib/rpc'
import { cn, fCurrency } from '@/utils'
import { CashBankSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { SummaryBox } from '@view'
import { Divider, Empty } from 'antd'

export const Card = ({
  cashBank,
  date,
  control_refetch,
  args,
}: {
  cashBank: CashBankSelect
  date: string
  control_refetch?: number
  args?: {
    have_moves: boolean
    have_balance: boolean
  }
}) => {
  const { have_balance = true, have_moves = true } = args ?? {}
  const query = useQuery({
    queryKey: ['req:rep-summary:' + cashBank.id, control_refetch],
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
    <div
      className={cn(
        'rounded-md border border-solid border-slate-100 flex flex-col min-h-[300px]',
        {
          hidden:
            (query.data && query.data.list.length == 0 && have_moves) ||
            (query.data &&
              query.data.initial == 0 &&
              query.data.final == 0 &&
              have_balance),
        },
      )}
    >
      <div className="font-bold p-3">{cashBank.cashbank}</div>
      <Divider className="my-0" />
      <div className="p-3 flex justify-between items-center text-sm text-slate-700">
        <p>SALDO INICIAL</p>
        <p>{fCurrency(query.data?.initial ?? 0)}</p>
      </div>
      <Divider className="my-0" />
      <div className="p-3 flex-1 my-2 flex flex-col space-y-2 overflow-y-auto">
        {!query.data || query.data.list.length == 0 ? (
          <Empty description="No se encontro requerimientos" className="" />
        ) : null}
        {query.data?.list.map((item) => {
          return (
            <div
              key={item.title}
              className="flex justify-between border-0 border-b border-slate-100 border-solid"
            >
              <span>{item.title}</span>
              <span>{fCurrency(item.total, false)}</span>
            </div>
          )
        })}
      </div>
      <Divider className="my-0" />
      <div className="p-3 flex justify-between items-center text-slate-700 text-sm">
        <p>SALDO FINAL</p>
        <p>{fCurrency(query.data?.final ?? 0)}</p>
      </div>
    </div>
  )
}
