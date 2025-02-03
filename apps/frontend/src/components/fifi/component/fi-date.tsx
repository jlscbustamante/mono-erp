import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { FilterComponentProps } from '../type'

const RangePicker = DatePicker.RangePicker

export function FiDatePicker(props: FilterComponentProps & { mode?: 'range' }) {
  const { fiValue, onFiChange } = props
  const date = fiValue as string
  return (
    <DatePicker
      value={date ? dayjs(date) : undefined}
      size="small"
      onChange={(date) => {
        if (date) {
          onFiChange?.(date.format('YYYY-MM-DD'))
        }
      }}
    />
  )
}

export function FiRangeDatePicker(
  props: FilterComponentProps & { mode?: 'range' },
) {
  const { fiValue, onFiChange } = props
  const date = fiValue as [string, string]
  return (
    <RangePicker
      value={date ? [dayjs(date[0]), dayjs(date[1])] : undefined}
      size="small"
      onChange={(date) => {
        if (date) {
          if (date[0] && date[1]) {
            onFiChange?.([
              date[0].format('YYYY-MM-DD'),
              date[1].format('YYYY-MM-DD'),
            ])
          }
        }
      }}
    />
  )
}
