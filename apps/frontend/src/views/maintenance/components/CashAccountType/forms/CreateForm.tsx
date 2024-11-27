import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { createTypeCashAccount } from '@/data/cashAccount/sdk'
import {
  ICreateTypeCashAccount,
  ITypeCashAccount,
} from '@/data/cashAccount/types/cashTypes'
import { CashAccountStatus } from '@/data/cashAccount/types/status'

const { Option } = Select
export const CreateForm: React.FC<{
  cashAccountType: ICreateTypeCashAccount | null
  setCashAccountType: Dispatch<SetStateAction<ITypeCashAccount | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setCashAccountType, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ICreateTypeCashAccount) => {
    try {
      await createTypeCashAccount(values)
      const idNot = toast.loading(
        'Creando tipo de cuenta de caja ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tipo de cuenta de caja creada',
        ...NOTIFICATION.updateLoading,
      })

      setCashAccountType(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  return (
    <Form
      form={form}
      name="createTypeCashAccount"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del tipo de caja',
          },
          {
            max: 100,
            message: 'El nombre debe tener como máximo 100 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type_id"
        label="Tipo de cuenta:"
        rules={[
          {
            max: 1,
            message: 'El Tipo de cuenta  debe tener como máximo 1 caracter',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={CashAccountStatus.Active}>
          <Option
            key={CashAccountStatus.Active}
            value={CashAccountStatus.Active}
          >
            Activo
          </Option>
          <Option
            key={CashAccountStatus.Inactive}
            value={CashAccountStatus.Inactive}
          >
            Inactivo
          </Option>
        </Select>
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Crear
        </Button>
      </Form.Item>
    </Form>
  )
}
