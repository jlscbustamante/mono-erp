import { Input, InputNumber, InputNumberProps, InputProps } from 'antd'
import type { FilterComponentProps } from '../type'

export function FiInput(props: FilterComponentProps & InputProps) {
  const { fiValue, onFiChange, ...restProps } = props
  return (
    <Input
      placeholder="Valor"
      {...restProps}
      value={fiValue ? (fiValue as string) : ''}
      onChange={(e) => onFiChange?.(e.target.value)}
    />
  )
}

export function FiInputNumber(props: FilterComponentProps & InputNumberProps) {
  const { fiValue, onFiChange, ...restProps } = props
  return (
    <InputNumber
      placeholder="Number"
      className="w-full"
      {...restProps}
      value={fiValue as number}
      onChange={(e) => onFiChange?.(e)}
    />
  )
}
