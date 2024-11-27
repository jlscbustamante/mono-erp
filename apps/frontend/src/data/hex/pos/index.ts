import config from '@/config'

interface ApiResponse {
  statusCode: number
  statusMessage: string
  result: {
    resultados: { IdItem: number; sumprod: string }[]
  }
}

export const getSalesPos = async (
  sucursalCode: string,
  start: string,
  end: string,
): Promise<
  {
    itemId: number
    quantity: number
  }[]
> => {
  try {
    const request = await fetch(
      config.hostPos +
        `/api/search/modalInventarioItemsVendidosGroupExt?start=${start}&end=${end}&store_id=${sucursalCode}`,
    )

    if (!request.ok) {
      throw new Error('!Ok request')
    }
    if (is5xx(request.status)) {
      throw new Error('5xx request')
    }
    const data: ApiResponse = await request.json()
    return data.result.resultados.map((el) => ({
      itemId: el.IdItem,
      quantity: Number(el.sumprod),
    }))
  } catch (err) {
    console.log(err)
    return []
  }
}

export enum DOC_STATUS {
  CREATED = 1,
  SENT = 4,
  REJECTED = 7,
  COMPLETED = 5,
}

export interface DocResponse {
  orden_nro: number
  doc_url: string
  doc_operacion: string
  doc_efact_id: null | string
  status: DOC_STATUS
  error: string
}

interface ApiResponse {
  orden_nro: number
  doc_url: string
  doc_operacion: string
  doc_efact_id: null | string
  status: DOC_STATUS
  prc_response: string
}

interface ResultApi2 {
  statusCode: number
  result: ApiResponse[]
}

export const getLegalDocs = async (docs: string[]): Promise<DocResponse[]> => {
  try {
    const request = await fetch(
      config.hostPos + `/api/facturacion/externo/erp?orders=${docs.join(',')}`,
    )

    if (!request.ok) {
      throw new Error('!Ok request')
    }
    if (is5xx(request.status)) {
      throw new Error('5xx request')
    }
    const data: ResultApi2 = await request.json()
    return data.result.map((el) => {
      if (!el.prc_response || el.prc_response == '') {
        return {
          ...el,
          error: 'a',
        } satisfies DocResponse
      }
      const error = JSON.parse(JSON.parse(el.prc_response))
      return {
        ...el,
        error: error?.description ?? '',
      } satisfies DocResponse
    })
  } catch (err) {
    console.log(err)
    return []
  }
}

const is5xx = (statusCode: number) => statusCode >= 500
