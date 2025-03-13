export const fCurrency = (value: number | string, showCurrency = true) => {
  if (typeof value != 'number') {
    value = parseFloat(value)
    if (isNaN(value)) {
      return NaN
    }
  }
  const val = Number(value)

  if (showCurrency) {
    return Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(val)
  }
  const num = Intl.NumberFormat('es-PE', {
    currency: 'PEN',
  }).format(val)
  if (!num.endsWith('.00')) {
    return `${num}.00`
  }
  return num
}
