import { Button, Form, Input, Select } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { getIIamRole } from '@/data/security/IamRole/sdk'
import { IIamRole } from '@/data/security/IamRole/type/IamRole'
import { createIIamUser } from '@/data/security/IamUser/sdk'
import { ICreateIamUser, IIamUser } from '@/data/security/IamUser/type/IamUser'
import { IamUserStatus } from '@/data/security/IamUser/type/status'

export const CreateForm: React.FC<{
  iamUser: ICreateIamUser | null
  setIamUser: Dispatch<SetStateAction<IIamUser | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setIamUser, onClose, reload }) => {
  const [form] = Form.useForm()

  const [roles, setRole] = useState<IIamRole[]>([])

  const onFinish = async (values: ICreateIamUser) => {
    try {
      await createIIamUser(values)

      const idNot = toast.loading('Creando usuario...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Usuario creado',
        ...NOTIFICATION.updateLoading,
      })
      setIamUser(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    async function fetchRoles() {
      try {
        const responseRoles = await getIIamRole()
        setRole(responseRoles)
      } catch (err: any) {
        toast.error(err.message, NOTIFICATION.error)
      }
    }

    fetchRoles()
  }, [])
  return (
    <Form
      form={form}
      name="createIamUser"
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
            message: 'Por favor ingrese el nombre',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
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

      <Form.Item name="rol_id" label="Tipo de rol">
        <Select>
          {roles.map((rol) => (
            <Select.Option key={rol.id} value={rol.id}>
              {rol.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={'password'}
        label="Contraseña"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la contraseña',
          },
          {
            min: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        ]}
      >
        <Input.Password type="password" />
      </Form.Item>

      <Form.Item name="status" label="Estado">
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
          Crear
        </Button>
      </Form.Item>
    </Form>
  )
}
