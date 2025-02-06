import { DatePicker, Form } from 'antd'
import dayjs from 'dayjs'

export const CustomDatePicker = ({
  value,
  onChange,
}: {
  value?: unknown
  onChange?: (value: string | undefined) => void
}) => {
  const { status } = Form.Item.useStatus()
  return (
    <DatePicker
      value={value ? dayjs(value as string) : undefined}
      onChange={(val) => {
        if (val) onChange?.(val.format('YYYY-MM-DD'))
        else onChange?.(undefined)
      }}
      className={`custom-input-${status}`}
    />
  )
}
