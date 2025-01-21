import 'react-toastify/dist/ReactToastify.css'
import './style.css'

import { Button, Divider, Input } from 'antd'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import {
  sendCode,
  validateEmail,
  validateInfo,
} from '@/data/security/IamRole/sdk'

export default function ResetPassword() {
  const [step, setStep] = useState(1)
  const [responseData, setResponseData] = useState<any>(null)

  const nextPage = () => {
    setStep(step + 1)
  }

  const prevPage = () => {
    setStep(step - 1)
  }

  return (
    <div className="bg-zinc-50 h-screen overflow-hidden font-sans">
      <div className="mx-auto" style={{ maxWidth: 450 }}>
        <h4 className="text-center my-5">RECUPERAR CONTRASEÑA</h4>
        <div className="mt-10">
          <PageByStep
            step={step}
            nextPage={nextPage}
            prevPage={prevPage}
            responseData={responseData}
            setResponseData={setResponseData}
          />
        </div>
        {step < 3 && (
          <div className="flex gap-2 items-center justify-center mt-3">
            <PaginationCircle isSelected={step === 1} />
            <PaginationCircle isSelected={step === 2} />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

const PageByStep: React.FC<{
  step: number
  nextPage: () => void
  prevPage?: () => void
  responseData: any
  setResponseData: React.Dispatch<React.SetStateAction<any>>
}> = ({ step, nextPage, prevPage, responseData, setResponseData }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    confirm: '',
  })

  switch (step) {
    case 1:
      return (
        <EmailSection
          nextPage={nextPage}
          email={data.email}
          onChangeEmail={(e) => setData({ ...data, email: e })}
          setResponseData={setResponseData}
        />
      )
    case 2:
      return (
        <CodeVerificationSection
          nextPage={nextPage}
          prevPage={prevPage}
          data={data}
          setData={setData}
          responseData={responseData}
          setResponseData={setResponseData}
        />
      )
    case 3:
      return <CongratsSection />
  }
}

const PaginationCircle: React.FC<{ isSelected?: boolean }> = ({
  isSelected,
}) => {
  const cl = isSelected ? 'w-5 h-5 bg-blue-500' : 'w-3 h-3 bg-gray-300'
  return <div className={`${cl} rounded-full`}></div>
}

const SectionW: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4 shadow-lg pt-8 pb-10 px-6 bg-white">
      {children}
    </div>
  )
}

const EmailSection: React.FC<{
  nextPage: () => void
  email: string
  onChangeEmail: (e: string) => void
  setResponseData: React.Dispatch<React.SetStateAction<any>>
}> = ({ nextPage, email, onChangeEmail, setResponseData }) => {
  const validEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const onNext = async () => {
    try {
      if (validEmail(email)) {
        if (await validateEmail(email)) {
          const response = await sendCode(email)
          setResponseData(response)
          nextPage()
        }
      } else {
        toast.error('Ingresa un correo válido', NOTIFICATION.error)
      }
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <SectionW>
      <h5>Ingresa tu correo</h5>
      <Input
        type="email"
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => onChangeEmail(e.target.value)}
      />
      <Button type="primary" onClick={onNext}>
        Siguiente
      </Button>
    </SectionW>
  )
}

const CodeVerificationSection: React.FC<{
  nextPage: () => void
  prevPage?: () => void
  data: {
    email: string
    password: string
    confirm: string
  }
  setData: (data: any) => void
  responseData: any
  setResponseData: React.Dispatch<React.SetStateAction<any>>
}> = ({ nextPage, prevPage, data, setData, responseData, setResponseData }) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
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
  const onChange = (val: string) => {
    if (!isNaN(Number(val))) {
      setOtp(val)
    }
  }

  const handleReset = async () => {
    try {
      setLoading(true)
      const email = data.email
      const password = data.password
      const hasLetter = /[a-zA-Z]/.test(data.password)
      const hasNumber = /\d/.test(data.password)
      const hasMinLength = data.password.length >= 8

      if (data.password !== data.confirm) {
        throw new Error('Las contraseñas no coinciden')
      }
      if (hasNumber && hasLetter && hasMinLength) {
        const responseInfo = await validateInfo(
          email,
          otp,
          responseData,
          password,
        )

        if (responseInfo) {
          setResponseData({})
          nextPage()
        } else {
          throw new Error('Error en la validación')
        }
      }
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionW>
      <h5>Revisa tu correo e ingresa el código</h5>
      <input
        type="text"
        className="border-x-0 border-t-0 border-blue-600 outline-none px-4 py-2 font-bold text-xl font-mono text-center"
        placeholder="0000"
        value={otp}
        onChange={(e) => onChange(e.target.value)}
      />
      <Divider />
      <h5>Ingresa tu nueva contraseña</h5>
      <Input.Password
        placeholder="Nueva contraseña"
        value={data.password}
        onChange={handlePasswordChange}
      />
      <Input.Password
        placeholder="Confirma contraseña"
        value={data.confirm}
        onChange={(e) => setData({ ...data, confirm: e.target.value })}
      />
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
      <div className="grid grid-cols-2 gap-1 mt-6">
        <Button onClick={prevPage} loading={loading} type="primary">
          Volver
        </Button>
        <Button type="primary" onClick={handleReset} loading={loading}>
          Cambiar Contraseña
        </Button>
      </div>
    </SectionW>
  )
}

const CongratsSection = () => {
  const [count, setCount] = useState(3)
  useEffect(() => {
    if (count <= 0) {
      window.location.replace('/auth/login')
    } else {
      setTimeout(() => {
        if (count > 0) setCount(count - 1)
      }, 1000)
    }
  }, [count])

  return (
    <SectionW>
      <h5 className="text-center text-green-500">¡Felicidades!</h5>
      <p className="text-center font-bold">Se ha actualizado tu contraseña</p>
      <p className="text-center">Redirigiendo en {count}</p>
    </SectionW>
  )
}
