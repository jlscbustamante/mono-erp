import { Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
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
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasMinLength = password.length >= 8
    const idNot = toast.loading('Actualizando usuario...', NOTIFICATION.loading)
    try {
      if (
        hasNumber &&
        hasLetter &&
        hasMinLength &&
        password === confirmarContrasena
      ) {
        await resetPasswordUser(iamUser?.id, password)
      }
      console.log(iamUser?.id)

      toast.update(idNot, {
        render: 'Usuario actualizado',
        ...NOTIFICATION.updateLoading,
      })
      onClose()
      reload()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const passwordRequirements = [
    {
      condition: /[a-zA-Z]/.test(nuevaContrasena),
      text: 'Debe contener al menos una letra.',
    },
    {
      condition: /\d/.test(nuevaContrasena),
      text: 'Debe contener al menos un número.',
    },
    {
      condition: nuevaContrasena.length >= 8,
      text: 'Debe tener al menos 8 caracteres.',
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
