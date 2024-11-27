// validar las fechas entre la fecha cerrada y la fecha de la accion x(despacho, compra,etc)

import { add, format, parseISO } from 'date-fns'

export const validateDates = (
  closedDate: string | null,
  date: string,
  code?: string,
): null | string => {
  const extra = code ? `${code}: ` : ''
  if (closedDate == null) return null
  if (closedDate == date) return null

  if (date < closedDate)
    return (
      extra +
      'La fecha no puede ser menor a la fecha del ultimo inventario cerrado'
    )

  const nextDate = format(add(parseISO(closedDate), { days: 1 }), 'yyyy-MM-dd')
  if (nextDate != date)
    return (
      extra +
      'No se puede generar inventario, cierre el inventario del dia anterior'
    )

  return null
}

export const validateDatesDispatch = (
  closedDate: string | null,
  date: string,
  code?: string,
): null | string => {
  const extra = code ? `${code}` : ''
  if (closedDate == null) return null
  if (closedDate == date) return null

  if (date < closedDate)
    return `No se puede despachar debido a que la tienda ${extra} ya ha cerrado el inventario.`

  const nextDate = format(add(parseISO(closedDate), { days: 1 }), 'yyyy-MM-dd')
  if (nextDate != date)
    return `No es posible registrar el despacho debido que la tienda ${extra} no cerró el inventario del día anterior. Por favor contacte al administrador de ${
      extra ?? 'la tienda'
    }.`

  return null
}
