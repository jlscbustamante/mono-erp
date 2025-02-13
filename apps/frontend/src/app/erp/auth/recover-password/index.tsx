import { useMutation } from '@tanstack/react-query'
import { Button, Carousel, Input } from 'antd'
import { ArrowLeft, Mail } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

export const RecoverPasswordPage = () => {
  const ref = useRef(null)
  const [email, setEmail] = useState('')

  const goTo = (index: number) => {
    ;(ref.current as any)?.goTo(index, false)
  }

  const sendOtpMt = useMutation({
    mutationFn: async (email: string) => {
      return 'na' + email
      // const request = await viewClient.api.view.iam['recover-email'].$post({
      //   json: {
      //     email,
      //   },
      // })

      // const data = await request.json()
      // if (!request.ok) throw new Error(data.message)
      // return data.data as string
    },
    onSuccess: (token) => {
      console.log('token : ', token)
      goTo(1)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleContinue = () => {
    sendOtpMt.mutate(email)
  }

  return (
    <div className="bg-sky-50 min-h-screen flex justify-center items-center">
      <Carousel
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
            onClick={() => goTo(0)}
          >
            <ArrowLeft className="h-auto w-4" />
            Volver
          </p>
          <div>
            {/* <p className="my-2">
              Ingresa el codigo de verificacion enviado a {email}
            </p> */}
            <Input.OTP />
            <div>{/* <Button></Button> */}</div>
          </div>
        </div>
      </Carousel>
    </div>
  )
}
