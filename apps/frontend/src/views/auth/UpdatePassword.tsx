import './style.css'

import { Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

import { ReactComponent as Logo } from '@/assets/logo.svg'
import { ITEM } from '@/const/localStorageItems'
import { NOTIFICATION } from '@/const/notification'
import { login } from '@/data/auth/sdk'
import { udpatePassword } from '@/data/security/IamRole/sdk'
export default function UpdatePassword() {
  const [loading, setLoading] = useState(false)
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const urlParams = new URLSearchParams(window.location.search)
  const tkp = urlParams.get('token')

  const navigate = useNavigate()
  useEffect(() => {
    if (!tkp) {
      navigate('/auth/login')
    }
  }, [])

  const handleReset = async () => {
    try {
      setLoading(true)
      const password = nuevaContrasena

      const hasLetter = /[a-zA-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasMinLength = password.length >= 8

      if (password !== confirmarContrasena) {
        throw new Error('Las contraseñas no coinciden')
      }
      if (hasNumber && hasLetter && hasMinLength) {
        const email = await udpatePassword(tkp, password)
        const session = await login(String(email), password)
        localStorage.setItem(ITEM.TOKEN, session.token)
        localStorage.setItem(ITEM.USER_BASIC_INFO, JSON.stringify(session.user))
        localStorage.setItem(
          ITEM.USER_PERMISSION,
          JSON.stringify(session.permissionData),
        )
        localStorage.removeItem(ITEM.tkp)
        setNuevaContrasena('')
        setConfirmarContrasena('')
        const idNot = toast.loading(
          'Actualizando contraseña ...',
          NOTIFICATION.loading,
        )
        toast.update(idNot, {
          render: 'Contraseña actualizada',
          ...NOTIFICATION.updateLoading,
        })
        toast.info('Iniciando sesión...', NOTIFICATION.info)
        setTimeout(() => {
          navigate('/modules')
        }, 2500)
      } else {
        throw new Error('Error en la validación')
      }
    } catch (err: any) {
      if (err.message === 'jwt expired') {
        toast.error('ENLACE EXPIRADO', NOTIFICATION.error)
      } else {
        toast.error(err.message, NOTIFICATION.error)
      }
    } finally {
      setLoading(false)
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

  useEffect(() => {
    toast.warning('Este enlace solo se podrá usar en los próximos 10 minutos')
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-4 shadow-lg pt-8 pb-10 px-6 bg-white responsive-container">
        <div className="flex justify-center mb-6">
          <Logo className="text-red-700 w-40 h-auto" />
        </div>
        <h5>Ingresa tu nueva contraseña</h5>
        <Form onFinish={handleReset}>
          <Form.Item name="username" style={{ display: 'none' }}>
            <Input type="text" autoComplete="username" aria-hidden="true" />
          </Form.Item>
          <Input.Password
            placeholder="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <Input.Password
            placeholder="Confirma contraseña"
            type="password"
            autoComplete="new-password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
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
            <div
              style={{
                marginLeft: '150px',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-6 justify-center place-content-center">
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  block
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
          <ToastContainer />
        </Form>
      </div>
    </div>
  )
}
