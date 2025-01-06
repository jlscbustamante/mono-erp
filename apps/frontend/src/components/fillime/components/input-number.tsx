import { InputNumber, InputNumberProps } from 'antd'
import { ComponentFiRender } from '../types'

export const FiInputNumber = (props: InputNumberProps & ComponentFiRender) => {
  const { filValue, onFilChange, ...validProps } = props
  return (
    <InputNumber
      size="small"
      {...validProps}
      value={filValue}
      onChange={(val) => {
        onFilChange(val)
      }}
    />
  )
}
