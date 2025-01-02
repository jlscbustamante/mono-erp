import { Button, Form, Input } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { resetPasswordUser } from '@/data/security/IamUser/sdk'
import { ICreateIamUser, IIamUser } from '@/data/security/IamUser/type/IamUser'

export const ResetForm: React.FC<{
  iamUser: ICreateIamUser | null
  setIamUser: Dispatch<SetStateAction<IIamUser | null>>
  onClose: () => void
  reload: () => void
}> = ({ iamUser, onClose, reload }) => {
  const [form] = Form.useForm()
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')

  const onFinish = async () => {
    const password = nuevaContrasena
    const hasMinLength = password.length >= 6
    try {
      if (hasMinLength && password === confirmarContrasena) {
        const idNot = toast.loading(
          'Actualizando usuario...',
          NOTIFICATION.loading,
        )
        await resetPasswordUser(iamUser?.id, password)
        toast.update(idNot, {
          render: 'Usuario actualizado',
          ...NOTIFICATION.updateLoading,
        })
        onClose()
        reload()
      } else {
        toast.error('Verifica las contraseñas', NOTIFICATION.error)
      }
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const passwordRequirements = [
    {
      condition: nuevaContrasena.length >= 6,
      text: 'Debe tener al menos 6 caracteres.',
    },
  ]

  return (
    <Form
      form={form}
      name="updateIamUser"
      onFinish={onFinish}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 16 }}
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
            message: 'Por favor ingrese el nombre',
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item name="password" label="Contraseña" className="text-right">
        <Input.Password onChange={(e) => setNuevaContrasena(e.target.value)} />
      </Form.Item>
      <Form.Item label="Confirma contraseña" className="text-right">
        <Input.Password
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
      </Form.Item>
      <div className="mt-3 text-center">
        {nuevaContrasena && (
          <ul
            style={{
              fontSize: 'x-small',
              textAlign: 'justify',
              lineHeight: '1.4',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '25px',
              marginBottom: '16px',
              marginTop: '0px',
            }}
          >
            {passwordRequirements.map((requirement, index) => (
              <li
                key={index}
                style={{
                  fontSize: 'small',
                  textAlign: 'justify',
                  marginBottom: '4px',
                }}
                className={requirement.condition ? 'valid' : 'invalid'}
              >
                {requirement.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Resetear Contraseña
        </Button>
      </Form.Item>
      <ToastContainer />
    </Form>
  )
}
