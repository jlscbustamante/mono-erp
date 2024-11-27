export const fNumber = (
  value: number | string | null | undefined,
  decimals = 2,
) => {
  if (value == null || value == undefined) return Number(0).toFixed(decimals)
  if (typeof value != 'number') {
    value = parseFloat(value)
    if (isNaN(value)) {
      return NaN
    }
  }
  return Number(value).toFixed(decimals)
}
