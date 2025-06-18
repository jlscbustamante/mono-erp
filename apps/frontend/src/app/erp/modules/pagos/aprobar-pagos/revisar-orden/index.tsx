import { viewClient } from '@/lib/rpc'
import { cn } from '@/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AdmPaymentOrderSelect,
  IAdmRequirementWithSupplierBank,
  ISelectMockAuthorizedUserDto,
  ORDER_PAYMENT_STATUS,
} from '@types'
import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { ArrowLeft } from 'lucide-react'
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
        requirements: IAdmRequirementWithSupplierBank[]
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
  const [show_otp_input, set_show_otp_input] = useState(false)
  const [show_dev_credentials, set_show_dev_credentials] = useState(false)

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
      set_show_otp_input(false)
      set_show_dialog_authorization(false)
      form.resetFields()
      // navigate(PATHS.erp.modulos.pagos.aprobarPagos.main)
    },
    onError: (error: any) => {
      toast.error(error.message ?? 'Error al enviar el pago al banco')
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

  const handle_validate_user = async () => {
    const order_id = query.data?.order.id
    if (order_id) {
      const { user, password } = form.getFieldsValue() as {
        user: string
        password: string
      }

      const req = await viewClient.api.view.payment.security.check_user.$post({
        json: {
          user,
          password,
        },
      })

      const content = await req.json()
      if (!req.ok) {
        toast.error(content.message)
        return
      }
      const is_valid = content.data as boolean
      if (!is_valid) {
        toast.error('El usuario no es valido, verifique sus credenciales')
      } else {
        set_show_otp_input(true)
      }
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
        title={show_otp_input ? 'Autorizar orden' : 'Validar usuario'}
        open={show_dialog_authorization}
        width={500}
        okText={show_otp_input ? 'Autorizar' : 'Continuar'}
        onCancel={() => {
          set_show_dialog_authorization(false)
          set_show_otp_input(false)
          form.resetFields()
        }}
        // TODO: revisar onClose
        // onClose={() => {
        //   form.resetFields()
        // }}
        okButtonProps={{
          loading: approve_payment_mt.isPending,
        }}
        cancelButtonProps={{
          disabled: approve_payment_mt.isPending,
        }}
        onOk={() => {
          // handle_authorization()
          if (show_otp_input) {
            handle_authorization()
          } else {
            handle_validate_user()
          }
        }}
      >
        <p
          className="text-blue-600 hover:text-blue-500 cursor-pointer"
          onClick={() => {
            set_show_dev_credentials(!show_dev_credentials)
          }}
        >
          {!show_dev_credentials
            ? 'Mostrar credenciales de desarrollo'
            : 'Ocultar credenciales de desarrollo'}
        </p>
        <div
          className={cn('bg-slate-100 rounded-md p-2 text-sm mb-1', {
            hidden: !show_dev_credentials,
          })}
        >
          <p className="font-semibold">Usuarios(desarrollo) : </p>
          <p>Gerson berrocal</p>
          <p>Usuario 2</p>
          <p className="font-semibold">Contraseña: </p>
          <p>123456</p>
          <p className="font-semibold">otp</p>
          <p>123456</p>
        </div>
        <div
          className={cn('mb-3', {
            hidden: !show_otp_input,
          })}
        >
          Ingresa el codigo enviado al número asociado a tu cuenta.
        </div>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout={show_otp_input ? 'vertical' : 'horizontal'}
        >
          <Form.Item
            label="Usuario"
            name="user"
            className="mb-2"
            hidden={show_otp_input}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            className="mb-2"
            hidden={show_otp_input}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            // label="Token"
            name="otp"
            hidden={!show_otp_input}
          >
            <Input.OTP className="" />
          </Form.Item>
        </Form>
      </Modal>
      <div className="bg-blue-50 min-h-screen text-sm">
        <div className="bg-white flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 hover:text-blue-500 border-0 border-r border-solid border-gray-300 mr-4 pl-2 pr-4 text-sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-auto" /> Volver
          </div>
          <h4 className="p-3 font-semibold text-slate-800 flex-1">
            Programar orden de pago
          </h4>
        </div>
        {query.data && (
          <div className="p-3 space-y-3">
            <CreateOrderForm order={query.data.order} />
            <div className="space-y-3 bg-white p-3 rounded-md">
              <div></div>
              <DataView requirements={query.data.requirements} />
              <div className=" grid grid-cols-2 gap-1 w-72 ml-auto">
                <p>Autorizacion 1 : </p>
                <p>{query.data.order.approved1_by}</p>
                <p>Autorizacion 2 : </p>
                <p>{query.data.order.approved2_by}</p>
              </div>
              <div
                className={cn('flex justify-end gap-1', {
                  hidden: ![
                    ORDER_PAYMENT_STATUS.REGISTERED,
                    ORDER_PAYMENT_STATUS.APPROVED,
                  ].includes(query.data.order.status as ORDER_PAYMENT_STATUS),
                })}
              >
                <Button
                  danger
                  type="primary"
                  onClick={() => set_show_dialog_delete(true)}
                >
                  Anular orden pago
                </Button>
                <Button type="primary" onClick={handle_authorization_dialogs}>
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
