import { appConfig } from '@/const/config'
import { hc } from 'hono/client'
import type { ViewType } from '../../../../../backend/views/rpc'

// type ViewType = any

export const getToken = () => {
  return localStorage.getItem('tk_admin') ?? ''
}

export const viewClient = hc<ViewType>(appConfig.clients.view, {
  fetch: (req: RequestInfo | URL, init?: RequestInit) =>
    fetch(req, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }),
})
// as any
