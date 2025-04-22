import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { AdmPaymentOrderSelect, AdmRequirementSelect } from '@types'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export const RevisarOrdenPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [delete_requirement_related, set_delete_requirement_related] =
    useState(false)
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

  const ContentDialog = (_props: {
    val: boolean
    change: (val: boolean) => void
  }) => (
    <div>
      <p>¿Está seguro de que desea anular esta orden de pago na?</p>
      {/* <label className="mt-1 flex items-center gap-2">
        <Checkbox
          value={val}
          onChange={(val) => {
            change(val.target.checked)
          }}
        />
        Anular los requerimientos relacionados
      </label> */}
    </div>
  )

  const handle_cancellation = () => {
    if (!id) {
      toast.error('No se ha encontrado la orden de pago')
      return
    }
    Modal.confirm({
      title: 'Anular orden de pago',
      content: (
        <ContentDialog
          val={delete_requirement_related}
          change={(val) => set_delete_requirement_related(val)}
        />
      ),
      onOk: async () => {
        const request = await viewClient.api.view.payment.order.$delete({
          json: {
            id: +id,
            delete_related: delete_requirement_related,
          },
        })
        const content = await request.json()
        if (!request.ok) {
          toast.error(content.message)
        } else {
          toast.success('Orden de pago anulada')
          navigate(PATHS.erp.modulos.pagos.aprobarPagos.main)
          set_delete_requirement_related(false)
        }
      },
    })
  }

  const handle_authorization = () => {
    //
  }

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
              <Button danger type="primary" onClick={handle_cancellation}>
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
  )
}
