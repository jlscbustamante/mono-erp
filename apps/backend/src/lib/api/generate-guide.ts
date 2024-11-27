import config from '../../config/config'
import { GuideSchema, GuideWithTransportScheme } from '../../core/common/types'

interface ApiResponse {
  message: string
  CODIGO: string
  ID: number
}

export const generateGuideApi = async (
  guideSchema: GuideSchema,
): Promise<string> => {
  const request = await fetch(config.generateGuideUrl, {
    method: 'POST',
    body: JSON.stringify(guideSchema),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!is2xxStatusCode(request.status) || !request.ok) {
    console.log('schema error : ', guideSchema)
    await handleError(request)
  }
  const data: ApiResponse = await request.json()
  console.log('[Guia] generada : ', data.CODIGO)
  return data.CODIGO
}

export const generateGuideWithTransportApi = async (
  guideSchema: GuideWithTransportScheme,
): Promise<string> => {
  const request = await fetch(config.generateGuideWithTransportUrl, {
    method: 'POST',
    body: JSON.stringify(guideSchema),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!is2xxStatusCode(request.status) || !request.ok) {
    console.log('schema error : ', guideSchema)
    await handleError(request)
  }
  const data: ApiResponse = await request.json()
  console.log('[Guia] generada : ', data.CODIGO)
  return data.CODIGO
}

const handleError = async (res: Response) => {
  try {
    const data: any = await res.json()
    console.log('Error al generar la guia: ', data)
    throw new Error(data.message)
  } catch (err: any) {
    throw new Error('Error al generar la guia')
  }
}

const is2xxStatusCode = (status: number) => {
  return status >= 200 && status < 300
}
