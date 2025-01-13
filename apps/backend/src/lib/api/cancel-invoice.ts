export const cancelInvoiceApi = async ({
  invoice,
  motivo,
}: {
  invoice: string
  motivo: string
}) => {
  const request = await fetch(
    'https://facturacion.pizzaraul.com/api/documentSunatVoided',
    {
      method: 'POST',
      body: JSON.stringify({
        source: 'ERP',
        order_id: invoice,
        motivo: motivo,
      }),
    },
  )

  if (!request.ok) throw new Error('No se pudo cancelar la factura')
}
