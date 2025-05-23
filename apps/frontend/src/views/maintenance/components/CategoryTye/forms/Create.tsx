import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { ICreateTypeCashAccount } from '@/data/cashAccount/types/cashTypes'
import { createTypeCategory } from '@/data/category/sdk'
import { CategoryStatus, ITypeCategory } from '@/data/category/types'

const { Option } = Select

export const CreateForm: React.FC<{
  typeCategory: ITypeCategory | null
  setTypeCategory: Dispatch<SetStateAction<ITypeCategory | null>>
  showUnsign?: boolean
  onClose: () => void
  reload: () => void
}> = ({ setTypeCategory, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ICreateTypeCashAccount) => {
    try {
      await createTypeCategory(values)
      const idNot = toast.loading(
        'Creando tipo de categoría ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tipo de categoría creada',
        ...NOTIFICATION.updateLoading,
      })
      setTypeCategory(null)
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
      name="createTypeCategory"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
      initialValues={{
        status: 'A',
      }}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del Tipo de Categoria',
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
        label="Tipo de categoria"
        rules={[
          {
            max: 1,
            message: 'El tipo de categoria debe tener como máximo 1 caracter',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="status" label="Estado">
        <Select defaultValue={CategoryStatus.Active}>
          <Option key={CategoryStatus.Active} value={CategoryStatus.Active}>
            Activo
          </Option>
          <Option key={CategoryStatus.Inactive} value={CategoryStatus.Inactive}>
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
