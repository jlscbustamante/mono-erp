import { Button } from 'antd'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export const RevisarOrdenPage = () => {
  return (
    <div className="bg-blue-50 min-h-screen">
      <h4 className="bg-white p-3 font-semibold text-slate-800 mb-3">
        Programar orden de pago
      </h4>
      <div className="p-3 space-y-3">
        <CreateOrderForm />
        <div className="space-y-3 bg-white p-3 rounded-md">
          <DataView />
          <div className="flex justify-end gap-1">
            <Button danger type="primary">
              Anular orden pago
            </Button>
            <Button type="primary">Autorizar orden</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
