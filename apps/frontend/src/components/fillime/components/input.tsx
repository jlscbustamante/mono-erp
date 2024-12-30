import { Input } from 'antd'
import { InputProps } from 'antd/lib'

export const FiInput = (
  props: InputProps & {
    filValue: string
    onFilChange: (value: string | undefined) => void
  },
) => {
  const { filValue, onFilChange, ...validProps } = props
  return (
    <Input
      {...validProps}
      value={filValue}
      onChange={(val) => {
        onFilChange(val.target.value)
      }}
    />
  )
}
