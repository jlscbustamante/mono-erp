import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export function CreateOrderPage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <h4 className="bg-white p-3 font-semibold text-slate-800 mb-3">
        Programar orden de pago
      </h4>
      <div className="p-3 space-y-3">
        <CreateOrderForm>
          <DataView />
        </CreateOrderForm>
      </div>
    </div>
  )
}
