import 'react-toastify/dist/ReactToastify.css'

import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import LoadingPage from '@/components/LoadingPage'
import ProfileLayout from '@/layout/ProfileLayout'
import FirstLogin from '@/views/auth/FirstLogin'
import { Login } from '@/views/auth/Login'
import ResetPassword from '@/views/auth/resetPassword'
import UpdatePassword from '@/views/auth/UpdatePassword'
import { Modules } from '@/views/Modules'

import { bankRouter } from './bank'
import { digitizationRouter } from './digitization'
import { maintenanceRouter } from './maintenance'
import { PATHS } from './paths'
import { productRouter } from './products'
import { reportRouter } from './report'
import { requestRouter } from './request'
import { securityRouter } from './security'
import { storeRouter } from './store'

const router = createBrowserRouter([
  {
    path: PATHS.login,
    element: <Login />,
  },
  {
    path: PATHS.updatePassword,
    element: <UpdatePassword />,
  },
  {
    path: PATHS.firstLogin,
    element: <FirstLogin />,
  },
  {
    path: PATHS.profile,
    element: <ProfileLayout />,
  },

  {
    path: PATHS.resetPassword,
    element: (
      <Suspense fallback={<LoadingPage />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <App />,
    children: [
      { path: PATHS.modules, element: <Modules /> },
      bankRouter,
      storeRouter,
      digitizationRouter,
      requestRouter,
      maintenanceRouter,
      securityRouter,
      productRouter,
    ],
  },
  reportRouter,
])

export default router
