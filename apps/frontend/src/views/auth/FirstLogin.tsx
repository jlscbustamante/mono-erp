import 'react-toastify/dist/ReactToastify.css'
import './style.css'
import 'react-toastify/dist/ReactToastify.css'

import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { ReactComponent as Logo } from '@/assets/logo.svg'
import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

export default function FirstLogin() {
  const tkp = localStorage.getItem(ITEM.tkp)
  const navigate = useNavigate()
  useEffect(() => {
    if (!tkp) {
      navigate('/auth/login')
    }
  }, [tkp, navigate])
  const name = JSON.parse(
    String(localStorage.getItem(ITEM.USER_BASIC_INFO)),
  ).name
  localStorage.removeItem(ITEM.TOKEN)

  return (
    <div className="bg-zinc-50 h-screen overflow-hidden font-sans flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center min-h-screen max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Logo className="text-red-700 w-40 h-auto" />
        </div>
        <div className="flex flex-col items-center text-center mb-10">
          <p>
            Hola {name}, por seguridad es necesario cambiar tu contraseña en tu
            primer inicio de sesión. Se te ha enviado un
            <strong>
              {' '}
              <span style={{ textTransform: 'uppercase', fontSize: 'larger' }}>
                enlace a tu correo
              </span>
            </strong>{' '}
            para cambiar la contraseña. Si tuvieras problemas, no dudes en
            contactar con el área de soporte. ¡Suerte!
          </p>
        </div>
        <div className="flex flex-col items-center mb-2">
          <Link to={PATHS.login}>Volver a iniciar sesión</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  )
}
