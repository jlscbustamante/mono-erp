import { ActionFilters } from '@/components/fillime/filter-actions'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker

export function Control() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <RangePicker size="small" />
        <ActionFilters />
      </div>
    </div>
  )
}
