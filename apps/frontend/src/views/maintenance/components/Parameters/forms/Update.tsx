import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateParameter } from '@/data/maintenance/Parameters/sdk'
import {
  ICreateParameter,
  IParameter,
} from '@/data/maintenance/Parameters/type/Parameters'
import { ParametersStatus } from '@/data/maintenance/Parameters/type/status'

export const UpdateForm: React.FC<{
  parameter: ICreateParameter | null
  setParameter: Dispatch<SetStateAction<IParameter | null>>
  onClose: () => void
  reload: () => void
}> = ({ setParameter, parameter, onClose, reload }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: IParameter) => {
    try {
      await updateParameter(parameter?.id, values)
      const idNot = toast.loading(
        'Actualizando parámetro ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Parámetro actualizado',
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
      name="updateParameters"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={parameter ? parameter.id : ''}
      >
        <Input maxLength={150} disabled />
      </Form.Item>
      <Form.Item
        name="type"
        label="Tipo"
        initialValue={parameter ? parameter.type : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el tipo de Parametro',
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
        initialValue={parameter ? parameter.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre del Parametro',
          },
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input maxLength={150} />
      </Form.Item>
      <Form.Item
        name="value"
        label="Valor"
        initialValue={parameter ? parameter.value : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el valor del Parametro',
          },
          {
            max: 250,
            message: 'El Valor debe tener como máximo 250 caracteres',
          },
        ]}
      >
        <Input maxLength={250} />
      </Form.Item>

      <Form.Item
        name="role"
        label="Rol"
        initialValue={parameter ? parameter.role : ''}
        rules={[
          {
            max: 5,
            message: 'El Rol debe tener como máximo 5 caracteres',
          },
        ]}
      >
        <Input maxLength={150} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={parameter ? (parameter.status == '1' ? '1' : '0') : ''}
      >
        <Select>
          <Select.Option
            key={ParametersStatus.Active}
            value={ParametersStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={ParametersStatus.Inactive}
            value={ParametersStatus.Inactive}
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
