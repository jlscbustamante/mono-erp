import { hc } from 'hono/client'
import type { ViewType } from '../../../../../backend/views/rpc'

const getToken = () => {
  return localStorage.getItem('tk_admin') ?? ''
}

export const viewClient = hc<ViewType>('http://localhost:8001/', {
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
