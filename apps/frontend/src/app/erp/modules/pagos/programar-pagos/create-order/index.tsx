import { ArrowLeft } from 'lucide-react'
import { DataView } from './data-view'
import { CreateOrderForm } from './orden-form'

export function CreateOrderPage() {
  return (
    <div className="bg-blue-50 min-h-screen text-sm">
      <div className="flex items-center bg-white p-3">
        <div
          className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 hover:text-blue-500 border-0 border-r border-solid border-gray-300 mr-4 pl-2 pr-4 text-sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-auto" /> Volver
        </div>
        <h4 className="bg-white font-semibold text-slate-800 ">
          Programar orden de pago
        </h4>
      </div>
      <div className="p-3 space-y-3">
        <CreateOrderForm>
          <DataView />
        </CreateOrderForm>
      </div>
    </div>
  )
}
