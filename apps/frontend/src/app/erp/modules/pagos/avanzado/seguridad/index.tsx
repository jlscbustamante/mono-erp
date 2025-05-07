import { Button } from 'antd'
import { Plus } from 'lucide-react'
import { useAddUser } from './add_user_drawer'
import { TableUsers } from './table_users'

export function AvanzadoSeguridad() {
  const { open } = useAddUser()
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="bg-white p-3 font-semibold text-slate-800 mb-3 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800">
          Usuarios autorizados para aprobar pagos
        </h4>
        <Button type="primary" size="small" onClick={() => open()}>
          <Plus />
        </Button>
      </div>
      <div className="px-3">
        <TableUsers />
      </div>
    </div>
  )
}
