import { REQUIREMENT_TYPE_DOCUMENT } from '@view'

export const requirement_type_doc_text = (type_id: string) => {
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.FACTURA) return 'Factura'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.BOLETA) return 'Boleta'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.TICKET_SALIDA) return 'Ticket salida'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.NOTA_CREDITO) return 'Nota credito'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.NOTA_DEBITO) return 'Factura'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.GUIA_REMISION) return 'Guia remision'
  if (type_id == REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA)
    return 'Guia transportista'

  return 'desconocido'
}
