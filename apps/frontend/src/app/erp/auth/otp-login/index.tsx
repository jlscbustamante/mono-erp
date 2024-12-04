import { PATHS } from '@/const/paths'
import { authApi } from '@/lib/api/auth'
import { useMutation } from '@tanstack/react-query'
import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSession } from '../../use-session'

export const OtpLoginPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setSession = useSession((st) => st.setSession)

  const [otp, setOtp] = useState('')

  const validateLoginMt = useMutation({
    mutationFn: (variables: { otp: string; token: string }) =>
      authApi.validateLogin(variables),
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (data) => {
      localStorage.setItem('tk_admin', data.token)
      setSession(data.session)
    },
  })

  const handleLogin = () => {
    const email = searchParams.get('email')
    const token = searchParams.get('tkp')
    if (email && token) {
      validateLoginMt.mutate({ otp, token })
    }
  }

  const resendCodeMt = useMutation({
    mutationFn: (variables: { token: string }) => authApi.resendOtp(variables),
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Codigo reenviado')
    },
  })

  useEffect(() => {
    if (!searchParams.get('tkp') || !searchParams.get('email')) {
      navigate(PATHS.erp.auth.main)
    }
  }, [])

  return (
    <div className="flex items-center justify-center bg-slate-100 h-screen">
      <div className="py-3 px-4 rounded-md bg-white w-96">
        <div
          className="inline-flex items-center gap-1 mb-3"
          onClick={() => {
            navigate(PATHS.erp.auth.main)
          }}
        >
          <FaArrowLeft className="h-auto w-4 text-slate-600" />
          <span className="text-sm underline">Volver</span>
        </div>
        <h3 className="text-lg font-semibold">Codigo de verificación</h3>
        <p className="text-slate-700">
          El codigo ha sido enviado al correo {searchParams.get('email')}
        </p>
        <div className="my-3 flex justify-center">
          <Input.OTP value={otp} onChange={(val) => setOtp(val)} />
        </div>
        <div>
          <p className="text-slate-700 text-center">
            ¿No recibiste el código?{' '}
            {resendCodeMt.isPending ? (
              <span className="text-blue-400">Enviando...</span>
            ) : (
              <span
                className="text-blue-700 hover:underline cursor-pointer"
                onClick={() => {
                  const token = searchParams.get('tkp')
                  if (token) resendCodeMt.mutate({ token })
                }}
              >
                Reenviar
              </span>
            )}
          </p>
        </div>
        <div className="my-3 text-center">
          <Button
            className=""
            type="primary"
            disabled={otp.length < 6}
            loading={validateLoginMt.isPending}
            onClick={handleLogin}
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
