import Control from './control'
import { DataView } from './data-view'

export function TransferenciaPage() {
  return (
    <div className="bg-blue-50 min-h-screen text-sm">
      <h4 className="bg-white p-3 font-semibold text-slate-800 mb-3">
        Transferencias
      </h4>
      <div className="px-3 space-y-1">
        <Control />
        <DataView />
      </div>
    </div>
  )
}
