import { safeAny } from './someAny'

export const filterOption = (
  input: string,
  option: { label: string; value: string },
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

export const filterSelectForm = (text: safeAny, element: safeAny) => {
  if (element?.children?.toLowerCase().includes(text.toLowerCase())) {
    return true
  }
  return false
}
