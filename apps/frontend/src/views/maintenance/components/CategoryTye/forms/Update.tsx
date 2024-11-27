import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateTypeCategory } from '@/data/category/sdk'
import {
  CategoryStatus,
  ICreateTypeCategory,
  ITypeCategory,
} from '@/data/category/types'

const { Option } = Select
export const UpdateForm: React.FC<{
  onClose: () => void
  reload: () => void
  typeCategory: ICreateTypeCategory | null
  setTypeCategory: Dispatch<SetStateAction<ITypeCategory | null>>
}> = ({ setTypeCategory, typeCategory, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ITypeCategory) => {
    try {
      await updateTypeCategory(typeCategory?.id, values)
      const idNot = toast.loading(
        'Actualizando tipo de categoría...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tipo de categoría actualizada',
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
      name="updateTypeCategory"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={typeCategory ? typeCategory.id : ''}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nombre"
        initialValue={typeCategory ? typeCategory.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del Cash Account',
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
        initialValue={typeCategory ? typeCategory.type_id : ''}
        rules={[
          {
            max: 1,
            message: 'El tipo de categoria debe tener como máximo 1 caracter',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={typeCategory ? typeCategory.status : ''}
      >
        <Select>
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
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
