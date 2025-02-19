import { cn } from '@/utils'
import { DatePicker, DatePickerProps, Form } from 'antd'
import dayjs from 'dayjs'

export const CustomDatePicker = ({
  value,
  onChange,
  className,
  props,
}: {
  value?: unknown
  onChange?: (value: string | undefined) => void
  className?: string
  props?: DatePickerProps
}) => {
  const { status } = Form.Item.useStatus()
  return (
    <DatePicker
      {...props}
      value={value ? dayjs(value as string) : undefined}
      onChange={(val) => {
        if (val) onChange?.(val.format('YYYY-MM-DD'))
        else onChange?.(undefined)
      }}
      className={cn(`custom-input-${status}`, className)}
    />
  )
}
