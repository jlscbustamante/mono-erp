import { DatePicker } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { ComponentFiRender } from '../types'

const RangePicker = DatePicker.RangePicker

export const FiRangePicker = (props: RangePickerProps & ComponentFiRender) => {
  const { filValue, onFilChange, ...validProps } = props
  return (
    <RangePicker
      size="small"
      {...validProps}
      value={filValue ? [dayjs(filValue[0]), dayjs(filValue[1])] : undefined}
      onChange={(val) => {
        if (val?.[0] && val?.[1])
          onFilChange([
            val[0].format('YYYY-MM-DD'),
            val[1].format('YYYY-MM-DD'),
          ])
        else onFilChange(undefined)
      }}
    />
  )
}
