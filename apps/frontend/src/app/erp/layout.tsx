import { appConfig } from '@/const/config'
import { PATHS, PATHS_MAIN } from '@/const/paths'
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
  const setSession = useSession((st) => st.setSession)
  const user = useSession((st) => st.user)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await authApi.userValidate()
        setSession(data)
      } catch (err: any) {
        if (location.pathname != PATHS.erp.modulos.mercaderia.stockAlmacen) {
          if (
            location.pathname != PATHS.erp.auth.otpLogin &&
            location.pathname != PATHS.erp.auth.main
          )
            navigate(PATHS.erp.auth.main)
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (location.pathname !== PATHS.erp.modulos.mercaderia.stockAlmacen) {
      if (user.userId != -1) {
        if (
          location.pathname == PATHS.erp.auth.main ||
          location.pathname == PATHS.erp.auth.otpLogin ||
          location.pathname == '/'
        ) {
          navigate(PATHS.erp.modulos.home)
        } else {
          if (!appConfig.ui.fullAccess) {
            if (!user.views.concat(PATHS_MAIN).includes(location.pathname)) {
              navigate(PATHS.erp.modulos.home)
            }
          }
        }
      }
    }
  }, [user])

  if (
    user.userId == -1 &&
    location.pathname != PATHS.erp.auth.main &&
    location.pathname != PATHS.erp.auth.otpLogin
  )
    return null
  return (
    <>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <ToastContainer />
    </>
  )
}
