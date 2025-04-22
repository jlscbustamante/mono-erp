import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { AdmPaymentOrderInsert, CreateOrderDto } from '@types'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { CompanySelectForm } from '../../../requerimientos/components/company-select'
import { useCreateOrderStore } from './state'

type T = keyof AdmPaymentOrderInsert

export const CreateOrderForm = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [form] = Form.useForm<AdmPaymentOrderInsert>()
  const requirements = useCreateOrderStore((st) => st.requirements)
  const set_requirements = useCreateOrderStore((st) => st.set_requirements)
  const navigate = useNavigate()

  const create_payment_order_mt = useMutation({
    mutationFn: async (data: CreateOrderDto) => {
      const res = await viewClient.api.view.payment.order.$post({
        json: data,
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      set_requirements([])
      navigate(PATHS.erp.modulos.pagos.programarPagos.main)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handle_save = () => {
    const order_data = form.getFieldsValue()
    if (requirements.length === 0) {
      toast.error('No hay requerimientos seleccionados')
    } else {
      create_payment_order_mt.mutate({
        ...order_data,
        requirement_ids: requirements.map((req) => req.id),
      })
    }
  }

  useEffect(() => {
    const total = requirements.reduce((acc, req) => {
      return acc + Number(req.amount)
    }, 0)
    form.setFieldValue('amount', total)
  }, [requirements])

  return (
    <div className="space-y-3 bg-white p-3 rounded-md">
      <div className="bg-white p-3 rounded-md">
        <Form
          name="req:create-order"
          form={form}
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          className="grid grid-cols-[400px_400px_1fr] gap-x-3"
        >
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies T}
          >
            <CompanySelectForm />
          </Form.Item>
          <Form.Item
            label="Operación"
            className="mb-1"
            name={'operation' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha carga"
            className="w-[440px] ml-auto mb-1"
            name={'payment_at' satisfies T}
          >
            <CustomDatePicker
              className="w-full"
              props={{
                minDate: dayjs(new Date()),
              }}
            />
          </Form.Item>
          <Form.Item
            label="Cuenta"
            className="mb-1"
            name={'bankaccount_number' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tipo de cuenta"
            className="mb-1"
            name={'bankaccount_type' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Moneda"
            className="w-[440px] ml-auto mb-1"
            name={'money' satisfies T}
          >
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Banco"
            className="mb-1"
            name={'bankaccount_name' satisfies T}
          >
            <Input />
          </Form.Item>
          <div></div>
          <Form.Item
            label="Importe a cargar"
            className="w-[440px] ml-auto mb-1"
            name={'amount' satisfies T}
          >
            <InputNumber className="w-full" readOnly />
          </Form.Item>
        </Form>
      </div>
      {children}
      <div className="text-right">
        <Button
          type="primary"
          onClick={handle_save}
          loading={create_payment_order_mt.isPending}
        >
          Programar orden pago
        </Button>
      </div>
    </div>
  )
}
