import { Checkbox, CheckboxProps } from 'antd'

export const CustomCheckbox = ({
  value,
  onChange,
  className,
  props,
}: {
  value?: unknown
  onChange?: (value: string | undefined) => void
  className?: string
  props?: CheckboxProps
}) => {
  return (
    <Checkbox
      {...props}
      className={className}
      checked={value == '1'}
      onChange={(val) => {
        if (val.target.checked) onChange?.('1')
        else onChange?.('0')
      }}
    />
  )
}
