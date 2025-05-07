import { viewClient } from '@/lib/rpc'
import { cn } from '@/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AdmPaymentOrderSelect,
  AdmRequirementSelect,
  ISelectMockAuthorizedUserDto,
  ORDER_PAYMENT_STATUS,
} from '@types'
import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export const RevisarOrdenPage = () => {
  const { id } = useParams()
  const { data: authorized_users } = useQuery({
    queryKey: ['req:sec:users'],
    queryFn: async () => {
      const req = await viewClient.api.view.payment.order.authorized_user.$get()
      const data = await req.json()
      if (!req.ok) {
        throw new Error(data.message)
      }
      return data.data as ISelectMockAuthorizedUserDto[]
    },
  })
  const [form] = Form.useForm()

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

  const need_authorization = useMemo(() => {
    const order = query.data?.order
    if (!order) return false

    const autorizaciones = [order.approved1_by, order.approved2_by]
    if (authorized_users?.every((el) => autorizaciones.includes(el.name))) {
      return false
    }

    return true
  }, [authorized_users, query.data])

  const [delete_requirement_related, set_delete_requirement_related] =
    useState(false)
  const [show_dialog_delete, set_show_dialog_delete] = useState(false)
  const [show_dialog_authorization, set_show_dialog_authorization] =
    useState(false)

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

  // send to bank
  const approve_payment_mt = useMutation({
    mutationFn: async ({
      order_id,
      user,
      password,
      otp,
    }: {
      order_id: number
      user: string
      password: string
      otp: string
    }) => {
      const req = await viewClient.api.view.payment.order.authorize.$post({
        json: {
          order_id,
          user,
          password,
          otp,
        },
      })
      if (!req.ok) {
        const content = await req.json()
        throw new Error(content.message)
      }
    },
    onSuccess: () => {
      toast.success('Orden de pago enviada al banco')
      query.refetch()
      // navigate(PATHS.erp.modulos.pagos.aprobarPagos.main)
    },
    onError: (error: any) => {
      toast.error('No se pudo enviar el pago al banco: ', error.message)
    },
  })

  const handle_authorization = async () => {
    if (query.data?.order.id) {
      const { user, password, otp } = form.getFieldsValue() as {
        user: string
        password: string
        otp: string
      }
      await approve_payment_mt.mutateAsync({
        order_id: query.data.order.id,
        otp,
        password,
        user,
      })
    }
  }

  const handle_authorization_dialogs = () => {
    if (need_authorization) {
      set_show_dialog_authorization(true)
    } else {
      Modal.info({
        maskClosable: true,
        title: 'Orden de pago ya autorizada',
        content: (
          <div className="">
            <p>No se puede autorizar esta orden</p>
          </div>
        ),
        okText: 'Aceptar',
      })
    }
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
      <Modal
        title="Autorizar orden"
        open={show_dialog_authorization}
        okText="Autorizar"
        onCancel={() => {
          set_show_dialog_authorization(false)
        }}
        onClose={() => {
          form.resetFields()
        }}
        okButtonProps={{
          loading: approve_payment_mt.isPending,
        }}
        cancelButtonProps={{
          disabled: approve_payment_mt.isPending,
        }}
        onOk={() => {
          handle_authorization()
        }}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="Usuario" name="user" className="mb-2">
            <Input />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" className="mb-2">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Token" name="otp" className="mb-2">
            <Input.OTP />
          </Form.Item>
        </Form>
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
              <div
                className={cn('flex justify-end gap-1', {
                  hidden:
                    query.data.order.status != ORDER_PAYMENT_STATUS.REGISTERED,
                })}
              >
                <Button
                  danger
                  type="primary"
                  onClick={() => set_show_dialog_delete(true)}
                >
                  Anular orden pago
                </Button>
                <Button
                  type="primary"
                  // onClick={() => set_show_dialog_authorization(true)}
                  onClick={handle_authorization_dialogs}
                >
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
