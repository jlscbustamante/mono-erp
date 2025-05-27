import Control from './control'
import { DataView } from './data-view'

export function ListaEsperaPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <h4 className="font-sans text-slate-800 font-semibold mb-2 p-3 bg-white">
        Lista de pagos en espera(3)
      </h4>
      <div className="px-3">
        <Control />
        <DataView />
      </div>
    </div>
  )
}
