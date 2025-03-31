import { Button } from 'antd'
import { RiFileExcel2Line } from 'react-icons/ri'

export const ExcelExportBtn = ({
  onExport,
  small = false,
}: {
  onExport: () => void
  small?: boolean
}) => {
  return (
    <Button
      className="font-semibold"
      onClick={onExport}
      size={small ? 'small' : 'middle'}
      type="primary"
    >
      <RiFileExcel2Line className="w-5 h-5 items-center" />
    </Button>
  )
}
