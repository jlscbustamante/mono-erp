export const fDate = (date: string) => {
  if (typeof date != 'string') return date
  return date.split(' ')[0]
}
