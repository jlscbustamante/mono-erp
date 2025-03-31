import { ExcelExportBtn } from '@/components/excel-btn'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { use_report_store } from './state'

export const Control = ({
  loading,
  handle_export_excel,
}: {
  loading: boolean
  handle_export_excel: () => void
}) => {
  const dates = use_report_store((st) => st.dates)
  const set_dates = use_report_store((st) => st.set_dates)
  const refetch = use_report_store((st) => st.refetch)

  return (
    <div className="flex justify-between items-center">
      <div className="space-x-2">
        <DatePicker.RangePicker
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(val) => {
            if (val && val[0] && val[1]) {
              const start = val[0].format('YYYY-MM-DD')
              const end = val[1].format('YYYY-MM-DD')
              set_dates(start, end)
            }
          }}
        />
        <Button type="primary" onClick={() => refetch()} loading={loading}>
          Cargar reporte
        </Button>
      </div>
      <ExcelExportBtn onExport={handle_export_excel} />
    </div>
  )
}
