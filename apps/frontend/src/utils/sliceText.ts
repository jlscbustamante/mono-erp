export const sliceText = (text: string, limit: number) => {
  if (typeof text != 'string') return text
  return text.length > limit ? text.slice(0, limit) + '...' : text
}
