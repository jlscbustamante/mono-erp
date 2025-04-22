import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { AdmPaymentOrderSelect, AdmRequirementSelect } from '@types'
import { Button } from 'antd'
import { useParams } from 'react-router'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export const RevisarOrdenPage = () => {
  const { id } = useParams()
  const query = useQuery({
    queryKey: ['orden-pago', id],
    enabled: !!id,
    queryFn: async () => {
      const request = await viewClient.api.view.payment.order.$get({
        query: {
          id: id!.toString(),
        },
      })
      const content = await request.json()
      if (!request.ok) {
        throw new Error(content.message)
      }
      return content.data as {
        order: AdmPaymentOrderSelect
        requirements: AdmRequirementSelect[]
      }
    },
  })
  return (
    <div className="bg-blue-50 min-h-screen">
      <h4 className="bg-white p-3 font-semibold text-slate-800 mb-3">
        Programar orden de pago
      </h4>
      {query.data && (
        <div className="p-3 space-y-3">
          <CreateOrderForm order={query.data.order} />
          <div className="space-y-3 bg-white p-3 rounded-md">
            <DataView requirements={query.data.requirements} />
            <div className="flex justify-end gap-1">
              <Button danger type="primary">
                Anular orden pago
              </Button>
              <Button type="primary">Autorizar orden</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
