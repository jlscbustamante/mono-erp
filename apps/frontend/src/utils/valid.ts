export const validateUrl = (text: any) => {
  if (typeof text !== 'string') return false

  return /^(ftp|http|https):\/\/[^ "]+$/.test(text)
}
