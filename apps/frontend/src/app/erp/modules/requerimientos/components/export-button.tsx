import { delay } from '@/utils'
import { RequirementSelect, WhereOption } from '@pizzadb'
import { Button } from 'antd'
import { RiFileExcel2Line } from 'react-icons/ri'
import { toast } from 'react-toastify'

export function ExportRequirements({
  filters,
}: {
  filters?: WhereOption<RequirementSelect>[]
}) {
  const handleExport = async () => {
    console.log('filters : ', filters)
    await delay(2000)
    toast.error('No se pudo generar el archivo: INVALID DATE')
  }

  return (
    <Button type="primary" onClick={handleExport}>
      <RiFileExcel2Line className="w-5 h-5 items-center" />
      Expotar
    </Button>
  )
}
