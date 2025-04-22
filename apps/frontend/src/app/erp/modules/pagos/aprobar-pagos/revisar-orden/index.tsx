import { viewClient } from '@/lib/rpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AdmPaymentOrderSelect, AdmRequirementSelect } from '@types'
import { Button, Checkbox, Modal } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export const RevisarOrdenPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [delete_requirement_related, set_delete_requirement_related] =
    useState(false)
  const [show_dialog_delete, set_show_dialog_delete] = useState(false)

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

  const cancel_order_mt = useMutation({
    mutationFn: async (props: { id: number; delete_related: boolean }) => {
      const req = await viewClient.api.view.payment.order.$delete({
        json: {
          id: props.id,
          delete_related: props.delete_related,
        },
      })
      if (!req.ok) {
        const content = await req.json()
        throw new Error(content.message)
      }
    },
  })

  const handle_cancellation = async () => {
    if (id)
      cancel_order_mt.mutate({
        id: parseInt(id),
        delete_related: delete_requirement_related,
      })
  }

  const handle_authorization = () => {
    //
  }

  return (
    <>
      <Modal
        title="Anular orden de pago"
        open={show_dialog_delete}
        onCancel={() => {
          set_show_dialog_delete(false)
        }}
        okButtonProps={{
          loading: cancel_order_mt.isPending,
        }}
        onOk={handle_cancellation}
      >
        <p>¿Está seguro de que desea anular esta orden de pago na?</p>
        <label className="mt-1 flex items-center gap-2">
          <Checkbox
            checked={delete_requirement_related}
            onChange={(val) => {
              set_delete_requirement_related(val.target.checked)
            }}
          />
          Anular los requerimientos relacionados
        </label>
      </Modal>
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
                <Button
                  danger
                  type="primary"
                  onClick={() => set_show_dialog_delete(true)}
                >
                  Anular orden pago
                </Button>
                <Button type="primary" onClick={handle_authorization}>
                  Autorizar orden
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
