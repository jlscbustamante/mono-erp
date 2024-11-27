import config from '../../config/config'
import { InvoiceSchema } from '../../core/common/types'

interface ApiResponse {
  message: string
  CODIGO: string
  IdDoc: number
}

export const generateInvoiceApi = async (
  invoceSchema: InvoiceSchema,
): Promise<string> => {
  const request = await fetch(config.facturationUrl, {
    method: 'POST',
    body: JSON.stringify(invoceSchema),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!is2xxStatusCode(request.status) || !request.ok) {
    console.log('schema error : ', invoceSchema)
    await handleError(request)
  }
  const data: ApiResponse = await request.json()
  console.log(
    '[Factura] generada : ',
    data.CODIGO + ' - ',
    invoceSchema.store_correlativo,
  )
  return data.CODIGO
}

const handleError = async (res: Response) => {
  try {
    const data: any = await res.json()
    console.log('Error al generar la factura : ', data)
    throw new Error(data.message)
  } catch (err: any) {
    throw new Error('Error al generar la factura')
  }
}

const is2xxStatusCode = (status: number) => {
  return status >= 200 && status < 300
}
