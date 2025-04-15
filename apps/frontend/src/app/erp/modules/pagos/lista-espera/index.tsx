import Control from './control'
import { DataView } from './data-view'

export function ListaEsperaPage() {
  return (
    <div className="min-h-screen p-3 bg-blue-50">
      <h4 className="font-sans text-slate-800 font-semibold mb-2">
        Lista de pagos en espera(3)
      </h4>
      <Control />
      <DataView />
    </div>
  )
}
