import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { createParameter } from '@/data/maintenance/Parameters/sdk'
import {
  ICreateParameter,
  IParameter,
} from '@/data/maintenance/Parameters/type/Parameters'
import { ParametersStatus } from '@/data/maintenance/Parameters/type/status'

const { Option } = Select

export const CreateForm: React.FC<{
  parameter: ICreateParameter | null
  setParameter: Dispatch<SetStateAction<IParameter | null>>
  showUnsign?: boolean
  onClose: () => void
  reload: () => void
}> = ({ setParameter, onClose, reload }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: ICreateParameter) => {
    try {
      await createParameter(values)

      const idNot = toast.loading('Creando parámetro ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Parámetro creado',
        ...NOTIFICATION.updateLoading,
      })
      setParameter(null)
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
      name="createParameter"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="type"
        label="Tipo"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el tipo del Parametro',
          },
          {
            max: 25,
            message: 'El Tipo debe tener como máximo 25 caracteres',
          },
        ]}
      >
        <Input maxLength={25} />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del Parametro',
          },
          {
            max: 150,
            message: 'El nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input maxLength={150} />
      </Form.Item>
      <Form.Item
        name="value"
        label="Valor"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el valor del Parametro',
          },
          {
            max: 250,
            message: 'El valor debe tener como máximo 250 caracteres',
          },
        ]}
      >
        <Input maxLength={250} />
      </Form.Item>

      <Form.Item
        name="role"
        label="Rol"
        rules={[
          {
            max: 5,
            message: 'El Rol debe tener como máximo 5 caracteres',
          },
        ]}
      >
        <Input maxLength={5} />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={ParametersStatus.Active}>
          <Option key={ParametersStatus.Active} value={ParametersStatus.Active}>
            Activo
          </Option>
          <Option
            key={ParametersStatus.Inactive}
            value={ParametersStatus.Inactive}
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
