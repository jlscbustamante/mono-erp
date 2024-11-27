import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { getIIamRole } from '@/data/security/IamRole/sdk'
import { IIamRole } from '@/data/security/IamRole/type/IamRole'
import { updateIIamUser } from '@/data/security/IamUser/sdk'
import { ICreateIamUser, IIamUser } from '@/data/security/IamUser/type/IamUser'
import { IamUserStatus } from '@/data/security/IamUser/type/status'

export const UpdateForm: React.FC<{
  iamUser: ICreateIamUser | null
  setIamUser: Dispatch<SetStateAction<IIamUser | null>>
  onClose: () => void
  reload: () => void
}> = ({ iamUser, onClose, reload }) => {
  const [roles, setRole] = useState<IIamRole[]>([])
  const [form] = Form.useForm()
  const onFinish = async (values: IIamUser) => {
    const idNot = toast.loading(
      'Actualizando usuario ...',
      NOTIFICATION.loading,
    )
    try {
      await updateIIamUser(iamUser?.id, values)
      toast.update(idNot, {
        render: 'Usuario actualizando',
        ...NOTIFICATION.updateLoading,
      })
      onClose()
      reload()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    async function fetchModulos() {
      try {
        const responseRol = await getIIamRole()
        setRole(responseRol)
      } catch (error: any) {
        toast.error(error.message, NOTIFICATION.error)
      }
    }

    fetchModulos()
  }, [])
  return (
    <Form
      form={form}
      name="updateIamUser"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item name="id" label="ID" initialValue={iamUser ? iamUser.id : ''}>
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nombre"
        initialValue={iamUser ? iamUser.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el nombre ',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        initialValue={iamUser ? iamUser.email : ''}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el correo electrónico',
          },
          {
            type: 'email',
            message: 'Por favor ingrese un correo electrónico válido',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="rol_id"
        label="Tipo de rol"
        initialValue={iamUser ? iamUser.rol_id : ''}
      >
        <Select>
          {roles.map((rol) => (
            <Select.Option key={rol.id} value={rol.id}>
              {rol.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={iamUser ? iamUser.status : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el estado',
          },
        ]}
      >
        <Select>
          <Select.Option
            key={IamUserStatus.Active}
            value={IamUserStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={IamUserStatus.Inactive}
            value={IamUserStatus.Inactive}
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
