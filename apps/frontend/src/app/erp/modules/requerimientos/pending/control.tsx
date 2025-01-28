import { ActionFilters } from '@/components/fillime/filter-actions'
import { PATHS } from '@/const/paths'
import { Button, DatePicker } from 'antd'
import { useNavigate } from 'react-router'

const { RangePicker } = DatePicker

export function Control() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <RangePicker size="small" />
        <ActionFilters />
      </div>
      <Button
        size="middle"
        type="primary"
        onClick={() => {
          navigate(PATHS.erp.modulos.requerimientos.creation)
        }}
      >
        Nuevo requerimiento
      </Button>
    </div>
  )
}
