// todo lo que tenga que ver con pos pizzaraul
// generar guia, facturas, etc

function is2xxStatusCode(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300
}
export class PosService {
  async generarGuia(dispatchId: number): Promise<{
    message: string
    CODIGO: string
    ID: number
    PDF: string
  }> {
    try {
      const response = await fetch(
        'https://pos.pizzaraul.work/efact/api/documentSunatGuia',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: dispatchId,
          }),
        },
      )

      const data = await response.json()
      if (!is2xxStatusCode(response.status)) {
        console.log(data)
        throw new Error('Error al generar guia')
      }
      return data
    } catch (err) {
      console.log(err)
      throw new Error(`Error al generar guia para este despacho`)
    }
  }
}
