import { viewClient } from '@/lib/rpc'
import { queryClient } from '@/main'
import { cn } from '@/utils'
import { CashBankSelect, CompanySelect } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AdmReqNondocsInsert,
  AdmReqNondocsViewDto,
  PAYMENT_STATUS,
} from '@types'
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

type T = keyof AdmReqNondocsInsert

export function NonDoc({ requirement }: { requirement: AdmReqNondocsViewDto }) {
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <div className="grid gap-1 grid-cols-2">
      {contextHolder}
      <DatosPrincipales
        requirement={requirement}
        messageInstance={messageApi}
      />
    </div>
  )
}

const DatosPrincipales = ({
  messageInstance,
  requirement,
}: {
  messageInstance?: MessageInstance
  requirement: AdmReqNondocsViewDto
}) => {
  const [form] = Form.useForm()
  const { data: companies } = useQuery({
    queryKey: ['rq:companies'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
    },
  })

  const { data: cashBanks } = useQuery({
    queryKey: ['rq:cashBanks'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const result = await request.json()
      return result.data as CashBankSelect[]
    },
  })

  const cancel_invoice_mt = useMutation({
    mutationFn: async (id: number) => {
      const request = await viewClient.api.view.payment.cancel_nondoc.$delete({
        json: {
          id: id,
        },
      })
      if (!request.ok) {
        const data = await request.json()
        throw new Error(data.message ?? 'Error al anular el requerimiento')
      }
    },
    onSuccess: () => {
      messageInstance?.success('Requerimiento anulado correctamente')
      queryClient.refetchQueries({
        queryKey: ['rq:non_doc:get_one', requirement.id.toString()],
      })
    },
    onError: (err) => {
      toast.error(err.message ?? 'Error al anular el requerimiento')
    },
  })

  useEffect(() => {
    form.setFieldsValue(requirement)
  }, [requirement])

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        form={form}
        name="rq:update_non_doc"
        initialValues={requirement}
        disabled={true}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies T}
          >
            <Select placeholder="Empresa">
              {companies?.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.razon_social}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'request_code' satisfies T}
            label="Codigo"
            className="mb-1"
          >
            <Input readOnly />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Cuenta origen"
            className="mb-1"
            rules={[{ required: true }]}
            name={'cashbank_source_id' satisfies T}
          >
            <Select placeholder="Caja">
              {cashBanks
                // ?.filter((el) => {
                //   if (company) {
                //     return el.company_id == company
                //   }
                //   return true
                // })
                ?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Cuenta destino"
            className="mb-1"
            rules={[{ required: true }]}
            name={'cashbank_target_id' satisfies T}
          >
            <Select placeholder="Caja">
              {cashBanks
                // ?.filter((el) => {
                //   if (company) {
                //     return el.company_id == company
                //   }
                //   return true
                // })
                ?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Detalle"
            className="col-span-2 mb-1"
            labelCol={{ offset: 2 }}
            wrapperCol={{ span: 22 }}
            name={'description' satisfies T}
          >
            <Input.TextArea placeholder="..." rows={1} className="-ml-1" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Monto" className="mb-1" name={'amount' satisfies T}>
            <InputNumber className="w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1" name={'money' satisfies T}>
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
        </div>
        {/* <Form.Item className="text-right" wrapperCol={{ span: 24 }}> */}
        {/* </Form.Item> */}
      </Form>
      <div
        className={cn('text-right', {
          hidden: requirement.status != PAYMENT_STATUS.APPROVED,
        })}
      >
        <Button
          type="primary"
          danger
          loading={cancel_invoice_mt.isPending}
          // onClick={() => cancel_invoice_mt.mutate(requirement.id)}
          onClick={() =>
            Modal.confirm({
              title: 'Anular requerimiento',
              content: '¿Estás seguro de que deseas anular este movimiento?',
              onOk: () => cancel_invoice_mt.mutate(requirement.id),
              okText: 'Anular',
              cancelText: 'Cancelar',
            })
          }
          htmlType="button"
        >
          Anular
        </Button>
      </div>
    </div>
  )
}
