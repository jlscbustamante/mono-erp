import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateTypeCashAccount } from '@/data/cashAccount/sdk'
import { ICashAccountType } from '@/data/cashAccount/types'
import {
  ICreateTypeCashAccount,
  ITypeCashAccount,
} from '@/data/cashAccount/types/cashTypes'
import { CashAccountStatus } from '@/data/cashAccount/types/status'

export const UpdateForm: React.FC<{
  cashAccountType: ICreateTypeCashAccount | null
  setCashAccountType: Dispatch<SetStateAction<ITypeCashAccount | null>>
  onClose: () => void
  reload: () => void
}> = ({ setCashAccountType, cashAccountType, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ICashAccountType) => {
    try {
      await updateTypeCashAccount(cashAccountType?.id, values)
      const idNot = toast.loading(
        'Actualizando tipo de cuenta de caja ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tipo de cuenta de caja actualizada',
        ...NOTIFICATION.updateLoading,
      })
      form.resetFields()
      setCashAccountType(null)
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Form
      form={form}
      name="updateTypeCashAccount"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
      initialValues={{
        status: 'A',
      }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={cashAccountType ? cashAccountType.id : ''}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="name"
        label="Nombre"
        initialValue={cashAccountType ? cashAccountType.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del Tipo de Cuenta ',
          },
          {
            max: 100,
            message: 'El Nombre debe tener como máximo 100 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type_id"
        label="Tipo de Cash ID"
        initialValue={cashAccountType ? cashAccountType.type_id : ''}
        rules={[
          {
            max: 1,
            message: 'El Account ID debe tener como máximo 1 caracter',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={cashAccountType ? cashAccountType.status : ''}
      >
        <Select>
          <Select.Option
            key={CashAccountStatus.Active}
            value={CashAccountStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={CashAccountStatus.Inactive}
            value={CashAccountStatus.Inactive}
          >
            Inactivo
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateForm
