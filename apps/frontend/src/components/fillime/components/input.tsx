import { Input, InputProps } from 'antd'
import { ComponentFiRender } from '../types'

export const FiInput = (props: InputProps & ComponentFiRender) => {
  const { filValue, onFilChange, ...validProps } = props
  return (
    <Input
      {...validProps}
      value={filValue}
      size="small"
      onChange={(val) => {
        onFilChange(val.target.value)
      }}
    />
  )
}
