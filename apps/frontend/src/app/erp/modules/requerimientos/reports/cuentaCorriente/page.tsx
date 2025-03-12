import { Control } from './control'
import { DataTable } from './data-table'

export function CuentaCorrientePage() {
  return (
    <div className="p-3 space-y-2">
      <Control />
      <DataTable />
    </div>
  )
}
