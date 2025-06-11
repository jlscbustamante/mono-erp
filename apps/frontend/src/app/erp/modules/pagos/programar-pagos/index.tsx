import { PATHS } from '@/const/paths'
import { Button } from 'antd'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import Control from './control'
import { DataView } from './data-view'

export function ProgramarPagosPage() {
  const navigate = useNavigate()

  const handle_navigation = () => {
    navigate(PATHS.erp.modulos.pagos.programarPagos.crearOrden)
  }

  return (
    <div className="min-h-screen bg-blue-50 text-sm">
      <div className="bg-white p-3 font-semibold text-slate-800 mb-3 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800">Pagos programados</h4>
        <Button type="primary" size="small" onClick={handle_navigation}>
          <Plus />
        </Button>
      </div>
      <div className="px-3">
        <Control />
        <DataView />
      </div>
    </div>
  )
}
