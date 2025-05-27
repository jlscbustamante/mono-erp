import { cn } from '@/utils'
import { Form, Switch, SwitchProps } from 'antd'

export const CustomSwitchNumber = ({
  value,
  onChange,
  className,
  props,
}: {
  value?: unknown
  onChange?: (value: string | undefined) => void
  className?: string
  props?: SwitchProps
}) => {
  const { status } = Form.Item.useStatus()
  return (
    <Switch
      {...props}
      // value={value ? dayjs(value as string) : undefined}
      checked={value === '1'}
      onChange={(val) => {
        // if (val) onChange?.(val.format('YYYY-MM-DD'))
        // else onChange?.(undefined)
        onChange?.(val ? '1' : '0')
      }}
      className={cn(`custom-input-${status}`, className)}
    />
  )
}
