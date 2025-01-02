import { DatePicker, DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import { ComponentFiRender } from '../types'

export const FiDatePicker = (props: DatePickerProps & ComponentFiRender) => {
  const { filValue, onFilChange, ...validProps } = props
  return (
    <DatePicker
      allowClear={false}
      {...validProps}
      value={filValue ? dayjs(filValue) : undefined}
      onChange={(val) => {
        if (val) onFilChange(val.format('YYYY-MM-DD'))
        else onFilChange(undefined)
      }}
    />
  )
}
