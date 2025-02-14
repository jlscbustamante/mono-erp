import { PATHS } from '@/const/paths'
import { authApi } from '@/lib/api/auth'
import { useMutation } from '@tanstack/react-query'
import { Button, Carousel, Input } from 'antd'
import { ArrowLeft, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSession } from '../../use-session'

export const RecoverPasswordPage = () => {
  const ref = useRef(null)
  const [email, setEmail] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const setSession = useSession((st) => st.setSession)
  const navigate = useNavigate()

  const goTo = (index: number) => {
    ;(ref.current as any)?.goTo(index, false)
  }

  const sendOtpMt = useMutation({
    mutationFn: async (email: string) => {
      const token = await authApi.resetPassword(email)
      return token
    },
    onSuccess: (token) => {
      setSearchParams({ token, email })
      goTo(1)
    },
    onError: (err) => {
      setSearchParams({})
      toast.error(err.message)
    },
  })

  const handleContinue = () => {
    sendOtpMt.mutate(email)
  }

  const validateOtpMt = useMutation({
    mutationFn: async (props: { otp: string; token: string }) => {
      const newToken = await authApi.validateOtp(props)
      return newToken
    },
    onSuccess: (newToken) => {
      setSearchParams({
        ...searchParams,
        token: newToken,
        secure: 'true',
      })
      goTo(2)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleValidateOtp = () => {
    validateOtpMt.mutate({ otp, token: searchParams.get('token') ?? '' })
  }

  const changePasswordMt = useMutation({
    mutationFn: async (props: { password: string; token: string }) => {
      const session = await authApi.changePassword(props)
      return session
    },
    onSuccess: (session) => {
      localStorage.setItem('tk_admin', session.token)
      setSession(session.session)
      navigate(PATHS.erp.modulos.home)
    },
    onError: (err) => {
      if (err.message.includes('exp')) {
        toast.error('El tiempo ha expirado. Cancele y vuelva a intentar')
      } else {
        toast.error(err.message)
      }
    },
  })

  const handleChangePassword = () => {
    changePasswordMt.mutate({
      password: newPassword,
      token: searchParams.get('token') ?? '',
    })
  }

  const onChange = () => {
    setOtp('')
    setNewPassword('')
  }

  useEffect(() => {
    if (searchParams.get('secure')) {
      goTo(2)
    } else if (searchParams.get('token')) {
      goTo(1)
    }
  }, [])

  return (
    <div className="bg-sky-50 min-h-screen flex justify-center items-center">
      <Carousel
        afterChange={onChange}
        className="w-[400px] h-auto"
        arrows={false}
        dots={false}
        ref={ref}
      >
        <div className="bg-white p-5 rounded-md h-auto">
          <div className="rounded-full h-12 w-12 bg-sky-400 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-auto text-white" />
          </div>
          <div className="space-y-3">
            <p>Ingresa tu correo para recuperar tu contraseña</p>
            <Input
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="primary"
              className="w-full"
              onClick={handleContinue}
              loading={sendOtpMt.isPending}
              disabled={email === ''}
            >
              Continuar
            </Button>
          </div>
        </div>
        <div className="bg-white p-5 rounded-md">
          <p
            className="inline-flex items-center cursor-pointer"
            onClick={() => {
              setSearchParams({})
              goTo(0)
            }}
          >
            <ArrowLeft className="h-auto w-4" />
            Volver
          </p>
          <div>
            <p className="my-2">
              Ingresa el codigo de verificacion enviado a{' '}
              {searchParams.get('email')}
            </p>
            <Input.OTP
              value={otp}
              onChange={(otpValue) => {
                setOtp(otpValue)
              }}
            />
            <div className="my-3">
              <Button
                type="primary"
                className="w-full"
                disabled={otp === ''}
                loading={validateOtpMt.isPending}
                onClick={handleValidateOtp}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-md">
          <p
            className="inline-flex items-center cursor-pointer"
            onClick={() => {
              setSearchParams({})
              goTo(0)
            }}
          >
            <ArrowLeft className="h-auto w-4" />
            Cancelar
          </p>
          <div>
            <p className="my-2">Ingresa la nueva contraseña</p>
            <Input.Password
              value={newPassword}
              onChange={(val) => {
                setNewPassword(val.target.value ?? '')
              }}
            />
            <div className="my-3">
              <Button
                type="primary"
                className="w-full"
                disabled={newPassword === ''}
                onClick={handleChangePassword}
                loading={changePasswordMt.isPending}
              >
                Cambiar contraseña
              </Button>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  )
}
