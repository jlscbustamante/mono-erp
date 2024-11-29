// Supports weights 100-900
import '@fontsource-variable/inter'
import 'dayjs/locale/es'
import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import es_ES from 'antd/lib/locale/es_ES'
import dayjs from 'dayjs'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { routerv2 } from './routerv2'
dayjs.locale('es')

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={es_ES}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routerv2} />
        </QueryClientProvider>
      </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>,
)
