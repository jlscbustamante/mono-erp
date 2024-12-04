import { PATHS } from '@/const/paths'
import { Button, Input } from 'antd'
import { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router'

export const OtpLoginPage = () => {
  const navigate = useNavigate()

  const [otp, setOtp] = useState('')

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
          El codigo ha sido enviado al correo xx@gmail.com
        </p>
        <div className="my-3 flex justify-center">
          <Input.OTP value={otp} onChange={(val) => setOtp(val)} />
        </div>
        <div>
          <p className="text-slate-700 text-center">
            ¿No recibiste el código?{' '}
            <span className="text-blue-700 hover:underline cursor-pointer">
              Reenviar
            </span>
          </p>
        </div>
        <div className="my-3 text-center">
          <Button className="" type="primary" disabled={otp.length < 6}>
            Iniciar Sésion
          </Button>
        </div>
      </div>
    </div>
  )
}
