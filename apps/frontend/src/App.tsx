/* eslint-disable react-hooks/rules-of-hooks */
import 'react-toastify/dist/ReactToastify.css'

import { Spin } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useRecoilState } from 'recoil'

import { ITEM } from './const/localStorageItems'
import { usePermissions } from './Permission'
import { userAuthState } from './states/userAuthState'
import { ErrorBoundary } from './views/ErrorBoundary'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userAuth, setUserAuth] = useRecoilState(userAuthState)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!userAuth) {
      const token = localStorage.getItem(ITEM.TOKEN)
      const userInfo = localStorage.getItem(ITEM.USER_BASIC_INFO)
      if (!userInfo || !token) {
        localStorage.removeItem(ITEM.TOKEN)
        localStorage.removeItem(ITEM.USER_BASIC_INFO)
        localStorage.removeItem(ITEM.USER_PERMISSION)
        localStorage.removeItem(ITEM.tkp)
        setTimeout(() => {
          navigate('/auth/login')
        }, 800)
      } else {
        setUserAuth({
          token,
          user: JSON.parse(userInfo),
          permissionData: () => '',
        })

        localStorage.setItem(ITEM.TOKEN, token)
        localStorage.setItem(ITEM.USER_BASIC_INFO, userInfo)

        if (location.pathname == '/') {
          navigate('/modules')
          setVerifying(false)
        } else setVerifying(false)

        setVerifying(false)
      }
    } else {
      setVerifying(false)
    }

    const userPermission = localStorage.getItem(ITEM.USER_PERMISSION)
    if (userPermission && location.pathname != '/modules')
      usePermissions(location.pathname, userPermission)
    if (!userPermission) {
      navigate('/auth/login')
    }
    if (
      JSON.parse(String(localStorage.getItem(ITEM.USER_BASIC_INFO))).password ==
      ''
    ) {
      const tkp = localStorage.getItem(ITEM.TOKEN)
      if (tkp) localStorage.setItem(ITEM.tkp, tkp)
      navigate('/auth/firstLogin')
    }
  }, [location.pathname])
  useEffect(() => {})
  return (
    <>
      {verifying ? (
        <div className="flex justify-center items-center h-screen flex-col gap-4">
          <Spin size="large" />
          <Title level={5}>Verificando sesión...</Title>
        </div>
      ) : (
        <>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
          <ToastContainer />
        </>
      )}
    </>
  )
}

export default App
