import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { safeAny } from '@/utils/someAny'

export const baseUrl = async <T>(
  endpoint: string,
  {
    method = 'GET',
    body,
    headers = {},
    query,
    formData = false,
    token,
    allResponse,
  }: {
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
    body?: safeAny
    headers?: HeadersInit
    query?: { [key: string]: safeAny }
    formData?: boolean
    token?: string
    allResponse?: boolean
  } = {},
): Promise<T> => {
  const bearerToken = token ? token : localStorage.getItem(ITEM.TOKEN)
  const defaultHeaders = {
    Authorization: `Bearer ${bearerToken ?? ''}`,
    'Content-Type': 'application/json',
  }
  let headersFinal: safeAny = { ...defaultHeaders, ...headers }
  if (formData) {
    headersFinal = new Headers()
    headersFinal.append('Authorization', `Bearer ${bearerToken ?? ''}`)
  }

  try {
    const urlQuery = query ? '?' + buildQueryHTTP(query) : ''
    const response = await fetch(`${config.API}/${endpoint}${urlQuery}`, {
      method,
      headers: headersFinal,
      body: body ? (formData ? body : JSON.stringify(body)) : undefined,
    })
    const data = await response.json()
    if (!response.ok) {
      if (data.message) throw new Error(data.message)
      else throw new Error(`Error en la petición: ${response.statusText}`)
    }
    if (data.data && !allResponse) return data.data
    return data
  } catch (error: safeAny) {
    console.error('Error en la petición:', error)
    if (error.message) throw new Error(error.message)
    else throw error
  }
}

function buildQueryHTTP(params: {
  [key: string]: string | number | string[]
}): string {
  const queryParams: string[] = []

  for (const key in params) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(key)) {
      const value = params[key]

      if (typeof value === 'string' || typeof value === 'number') {
        queryParams.push(`${key}=${encodeURIComponent(value.toString())}`)
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (!item) return
          queryParams.push(`${key}[]=${encodeURIComponent(item.toString())}`)
        })
      }
    }
  }

  return queryParams.join('&')
}
