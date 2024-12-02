import { PATHS } from '@/const/paths'
import { authApi } from '@/lib/api/auth'
import { ErrorBoundary } from '@/views/ErrorBoundary'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from './use-session'

export const ErpLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = useSession((st) => st.userId)
  const setSession = useSession((st) => st.setSession)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await authApi.userValidate()
        setSession(data)
      } catch (err: any) {
        navigate(PATHS.erp.auth.main)
      }
    })()
  }, [])

  useEffect(() => {
    if (userId != -1) {
      if (
        location.pathname == PATHS.erp.auth.main ||
        location.pathname == '/'
      ) {
        navigate(PATHS.erp.modulos.home)
      }
    }
  }, [userId])

  if (userId == -1 && location.pathname != PATHS.erp.auth.main) return null
  return (
    <>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <ToastContainer />
    </>
  )
}
