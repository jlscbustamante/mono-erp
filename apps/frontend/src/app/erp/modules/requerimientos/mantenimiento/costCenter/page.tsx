import { Control } from './control'
import { DataTable } from './data-table'

export default function CostCenterPage() {
  return (
    <div className="p-3 space-y-3">
      <Control />
      <DataTable />
    </div>
  )
}
