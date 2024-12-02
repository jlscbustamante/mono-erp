import 'react-toastify/dist/ReactToastify.css'

import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

import { ReactComponent as Logo } from '@/assets/logo.svg'
// import Logo from '@/assets/logo.png'
import { ITEM } from '@/const/localStorageItems'
import { NOTIFICATION } from '@/const/notification'
import { authApi } from '@/lib/api/auth'

export const Login = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen">
      <div className="flex justify-center">
        <Logo className="text-red-700 w-40 h-auto" />
        {/* <img src={Logo} className="text-red-700 w-16 h-auto" /> */}
      </div>
      <div className="flex justify-center mt-10">
        <FormLogin />
      </div>
      <ToastContainer />
    </div>
  )
}

const FormLogin = () => {
  localStorage.removeItem(ITEM.tkp)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  localStorage.removeItem(ITEM.tkp)
  const navigate = useNavigate()
  const handleLogin = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      const token = await authApi.login({ email, password })
      console.log('tokeN : ', token)
      // const authResponse = await sdk.login(email, password)
      // setUserAuth(authResponse)
      // localStorage.setItem(ITEM.TOKEN, authResponse.token)
      // localStorage.setItem(
      //   ITEM.USER_BASIC_INFO,
      //   JSON.stringify(authResponse.user),
      // )
      // localStorage.setItem(
      //   ITEM.USER_PERMISSION,
      //   JSON.stringify(authResponse.permissionData),
      // )

      // const data = await authApi.userValidate()
      // setSession(data)
      // // toast.dismiss()
      // navigate(PATHS.erp.modulos.home)
    } catch (err: any) {
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    }
  }
  return (
    <Form
      name="wrap"
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 320 }}
      onFinish={handleLogin}
      onSubmitCapture={(e) => {
        e.preventDefault()
      }}
    >
      <Form.Item name="email" rules={[{ required: true }]}>
        <Input
          prefix={<AiOutlineUser />}
          type="emai"
          placeholder="Ingrese su correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password
          prefix={<RiLockPasswordLine />}
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <div className="mb-3">
        {/* ¿Olvidaste tu contraseña? <Link to={}>Recupérala aqui</Link> */}
      </div>
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit">
          Ingresar
        </Button>
      </Form.Item>
    </Form>
  )
}
