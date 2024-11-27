import { Button, Divider, Form, Input } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'

import { ITEM } from '@/const/localStorageItems'
import { NOTIFICATION } from '@/const/notification'
import { resetPassword } from '@/data/security/IamRole/sdk'

import { MenuConfig } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'

export default function ProfileLayout() {
  const [form] = Form.useForm()
  const [data, setData] = useState({
    email: '',
    pass: '',
    password: '',
    confirm: '',
  })

  const hasLetter = /[a-zA-Z]/.test(data.password)
  const hasNumber = /\d/.test(data.password)
  const hasMinLength = data.password.length >= 8

  const passwordRequirements = [
    {
      condition: hasLetter,
      text: 'Debe contener al menos una letra.',
    },
    {
      condition: hasNumber,
      text: 'Debe contener al menos un número.',
    },
    {
      condition: hasMinLength,
      text: 'Debe tener al menos 8 caracteres.',
    },
  ]

  const handlePasswordChange = (e: { target: { value: any } }) => {
    const newPassword = e.target.value
    setData({ ...data, password: newPassword })
  }

  const handlePasswordChanges = (e: { target: { value: any } }) => {
    const newPassword = e.target.value
    setData({ ...data, pass: newPassword })
  }

  const navigate = useNavigate()
  const name = JSON.parse(
    String(localStorage.getItem(ITEM.USER_BASIC_INFO)),
  ).name
  const email = JSON.parse(
    String(localStorage.getItem(ITEM.USER_BASIC_INFO)),
  ).email

  const [configNavigation] = useState<MenuConfig | undefined>({
    title: '',
    twBackground: undefined,
    twText: undefined,
  })

  const handleCancel = () => {
    navigate('/modules')
  }

  const handleReset = async () => {
    try {
      const change = await resetPassword(email, data.pass, data.password)
      if (change.success) {
        form.setFieldsValue({
          password: '',
          confirm: '',
          newpassword: '',
        })
        setData({
          email: '',
          pass: '',
          password: '',
          confirm: '',
        })
        toast.success(change.message, NOTIFICATION.success)
      } else {
        toast.error(change.message, NOTIFICATION.error)
      }
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <div
      style={{
        background: '#f0f0f0',

        minHeight: '100vh',
      }}
    >
      <NavigationLayout config={configNavigation} defaultTitle="Mi Perfil" />
      <div>
        <div
          style={{
            background: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Form
            form={form}
            style={{
              textAlign: 'center',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '400px',
              marginTop: '0',
            }}
          >
            <p style={{ marginBottom: '16px', color: '#333' }}>Mis Datos</p>

            <Form.Item name="id" initialValue={name}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="email" initialValue={email}>
              <Input disabled />
            </Form.Item>
            <Divider />
            <p style={{ marginBottom: '16px', color: '#333' }}>
              Cambio de contraseña
            </p>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Campo requerido',
                },
              ]}
            >
              <Input.Password
                placeholder="Ingresa tu contraseña actual"
                value={data.pass}
                onChange={handlePasswordChanges}
              />
            </Form.Item>
            <Form.Item
              name="newpassword"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingrese la contraseña',
                },
              ]}
            >
              <Input.Password
                placeholder="Nueva contraseña"
                value={data.password}
                onChange={handlePasswordChange}
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingrese la contraseña',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('Las contraseñas no coinciden'),
                    )
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirma contraseña"
                value={data.confirm}
                onChange={(e) => setData({ ...data, confirm: e.target.value })}
              />
            </Form.Item>
            {form.getFieldValue('newpassword') && (
              <div className="mt-3 text-center">
                <ul
                  style={{
                    fontSize: 'x-small',
                    textAlign: 'justify',
                    lineHeight: '1.2',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px',
              }}
            >
              <Button
                type="primary"
                danger
                htmlType="submit"
                style={{ marginRight: '8px' }}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="primary" onClick={handleReset}>
                Cambiar Contraseña
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
