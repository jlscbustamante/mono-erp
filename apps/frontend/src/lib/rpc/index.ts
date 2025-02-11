import { appConfig } from '@/const/config'
import { hc } from 'hono/client'
import type { ClientType, ViewType } from '@viewrpc'

const getToken = () => {
  return localStorage.getItem('tk_admin') ?? ''
}

export const viewClient: ClientType = hc<ViewType>(appConfig.clients.view, {
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
